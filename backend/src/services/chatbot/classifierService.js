const gemini = require("../../config/gemini");
const departmentServices = require("../departmentServices");
const facultyServices = require("../facultyServices");
const facilityServices = require("../facilityServices");
const subjectServices = require("../subjectServices");
const academicServices = require("../academicServices");


const KNOWN_TOPICS = ["department", "faculty", "event", "aboutUs", "facility", "subject", "academic"];
const MAX_HISTORY_TURNS = 6;
const MAX_REQUESTS = 4;


const FALLBACK_CLASSIFICATION = {
    requests: [],
    isGreetingOrSmallTalk: false
};



// Renders the last few turns as plain text so the model can resolve
// pronouns ("her", "his") and elliptical follow-ups ("and the HOD?")
// against what was actually asked and answered before.

const formatHistory = (history) => {
    if (!Array.isArray(history) || !history.length) {
        return "(this is the first message in the conversation)";
    }
    return history
        .slice(-MAX_HISTORY_TURNS)
        .map(turn => `Student: ${turn.question}\nAssistant: ${turn.answer}`)
        .join("\n\n");

};



// Validates one entry of the "requests" array against real DB values,
// discarding anything that doesn't check out rather than trusting it.

const sanitizeRequest = (raw, validDepartmentCodes, validDesignations, validFacilityCategories, validSubjectTypes, validSubjectDepartments) => {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const topic = KNOWN_TOPICS.includes(raw.topic) ? raw.topic : null;

    if (!topic) {
        return null;
    }

    const departmentCode = validDepartmentCodes.includes(raw.departmentCode)
        ? raw.departmentCode
        : null;

    // A faculty member can have multiple independent designations.
    // Keep only exact values that exist in the database and remove duplicates.

    const designationQueries = Array.isArray(raw.designationQueries)
        ? [...new Set(raw.designationQueries.filter(designation =>typeof designation === "string" && validDesignations.includes(designation)))]
        : [];



    const facultyNameQuery = typeof raw.facultyNameQuery === "string" && raw.facultyNameQuery.trim()
        ? raw.facultyNameQuery.trim()
        : null;


    const facilityCategoryQuery = validFacilityCategories.includes(raw.facilityCategoryQuery)
        ? raw.facilityCategoryQuery
        : null;

    const facilityNameQuery = typeof raw.facilityNameQuery === "string" && raw.facilityNameQuery.trim()
        ? raw.facilityNameQuery.trim()
        : null;


    const subjectNameQuery = typeof raw.subjectNameQuery === "string" && raw.subjectNameQuery.trim()
        ? raw.subjectNameQuery.trim()
        : null;

    const subjectTypeQuery = validSubjectTypes.includes(raw.subjectTypeQuery)
        ? raw.subjectTypeQuery
        : null;


    const subjectDepartmentQuery = validSubjectDepartments.includes(raw.subjectDepartmentQuery)
        ? raw.subjectDepartmentQuery
        : null;

    return {
        topic,
        departmentCode,
        facultyNameQuery,
        designationQueries,
        facilityCategoryQuery,
        facilityNameQuery,
        subjectNameQuery,
        subjectTypeQuery,
        subjectDepartmentQuery
    };
};



// The model is asked for pure JSON, but we defensively pull out the
// first JSON object in the response in case it adds stray text, and
// validate every field before trusting it.
const parseClassification = (rawText, validDepartmentCodes, validDesignations, validFacilityCategories, validSubjectTypes, validSubjectDepartments) => {
    if (!rawText) {
        return FALLBACK_CLASSIFICATION;
    }
    const match = rawText.match(/\{[\s\S]*\}/);

    if (!match) {
        return FALLBACK_CLASSIFICATION;
    }

    try {
        const parsed = JSON.parse(match[0]);
        const rawRequests = Array.isArray(parsed.requests) ? parsed.requests : [];
        const requests = rawRequests
            .map(raw => sanitizeRequest(raw, validDepartmentCodes, validDesignations, validFacilityCategories, validSubjectTypes, validSubjectDepartments))
            .filter(Boolean)
            .slice(0, MAX_REQUESTS);
        return {
            requests,
            isGreetingOrSmallTalk: parsed.isGreetingOrSmallTalk === true
        };
    } catch (error) {
        return FALLBACK_CLASSIFICATION;

    }

};



// Understands the student's question — which may ask about MORE THAN
// ONE thing at once (e.g. "the principal and the college name") — and
// breaks it into one request per distinct thing, using recent
// conversation history to resolve follow-ups. Only ever allowed to
// pick a department, designation, facility category, subject type, or
// subject department that genuinely exists.

const classifyQuestion = async (question, history = []) => {

    const [departments, designations, facilityCategories, subjectTypes, subjectDepartments] = await Promise.all([
        departmentServices.getDepartments(),
        facultyServices.getDesignations(),
        facilityServices.getCategories(),
        subjectServices.getSubjectTypes(),
        subjectServices.getDepartmentNames(),
    ]);

    const validDepartmentCodes = departments.map(department => department.code);
    const validDesignations = designations.filter(Boolean);
    const validFacilityCategories = facilityCategories.filter(Boolean);
    const validSubjectTypes = subjectTypes.filter(Boolean);
    const validSubjectDepartments = subjectDepartments.filter(Boolean);

    const departmentList = departments
        .map(department => `- code: "${department.code}", name: "${department.name}"`)
        .join("\n") || "(no departments in the database yet)";


    const designationList = validDesignations
        .map(designation => `- "${designation}"`)
        .join("\n") || "(no faculty designations in the database yet)";


    const facilityCategoryList = validFacilityCategories
        .map(category => `- "${category}"`)
        .join("\n") || "(no facility categories in the database yet)";


    const subjectTypeList = validSubjectTypes
        .map(type => `- "${type}"`)
        .join("\n") || "(no subject types in the database yet)";

    const subjectDepartmentList = validSubjectDepartments
        .map(department => `- "${department}"`)
        .join("\n") || "(no subject departments in the database yet)";



    const prompt = `
You are the routing layer for a college campus chatbot backend. You do
not answer the question yourself — you only classify it.
A single student question can ask about MORE THAN ONE thing at once
(e.g. "tell me about the principal and the college name" asks about
BOTH a faculty designation AND general college info). Break the
question into one entry per distinct thing being asked, in the
"requests" array below — do not squash a compound question into a
single topic, and do not silently drop part of it.

Available topics (this is ALL the data the backend can retrieve; do
not pick a topic just because a part of the question sounds college-related):

- "department": a department's name, code, or head of department (HOD)
- "faculty": a faculty member/teacher/professor/principal, either a specific person, everyone in a department, or everyone with a given designation/role
- "event": college events, seminars, workshops, fests
- "academic": a general information about admission, registration and enrollment processes, curriculum/syllabus, disciplinary rules, academic calendar, examination related queries etc.
- "aboutUs": general information about the college itself — its name, history, establishment year, address, vision/mission, accreditation, etc.
- "facility": a physical campus facility — labs, hostels, library, seminar rooms, sports areas, or any other facility category, either a specific named facility, everyone facility of a given category, or facilities belonging to a department
- "subject": subjects/courses/papers taught — a specific subject by name, the subjects of a department, or of a given type (e.g. theory/practical), including a subject's syllabus. A subject's "department" here is a plain label stored on the subject itself, NOT the same list as the "department" topic's codes below — use the separate "subject departments" list further down for this.

(If part of the question is about something NOT in this list — notices, placements, etc. — simply omit that part; do not invent a topic for it.)

Known departments (copy a "code" EXACTLY if a part of the question refers to one of these, otherwise use null — never invent a code):
${departmentList}

Known faculty designations/roles actually used in the database (copy each designation EXACTLY if a part of the question asks about a role such as "lecturers", "HODs", "selection grade lecturers", "the principal", etc., otherwise use an empty array):
${designationList}

IMPORTANT RULES FOR FACULTY DESIGNATIONS:
- A faculty member can have MORE THAN ONE designation.
- Each designation in the database is an independent value/tag. For example, a faculty member may have ["Lecturer", "Selection Grade", "HOD", "Principal"].
- For HOD (Head Of Department) related queries always go for data availale in department, unless explicitely asked for fully detailed data of the hod.
- Never combine multiple designations into a single value or phrase.
- Never invent, rename, split, merge, or assume equivalence between designations.
- Use only the exact designation values provided in the known faculty designations list above.
- If the question asks for faculty members having a particular role, include the matching designation in "designationQueries".
- If the question asks for faculty members having more than one role/designation, include every explicitly requested designation in "designationQueries".
- If the question uses a phrase that corresponds to more than one independent designation in the list, include each matching exact designation.
- If the question asks for faculty members with ANY of the listed designations (OR meaning), include all matching designations in the array.
- If the question asks for a specific faculty member by name, use "facultyNameQuery" instead of using designations to identify that person.
- If no designation is relevant to the faculty request, return an empty array.

Known facility categories actually used in the database (copy one EXACTLY if a part of the question asks about a category of facility such as "labs", "hostels", "the library", "sports facilities", etc., otherwise use null — never invent one):
${facilityCategoryList}

Known subject types actually used in the database (copy one EXACTLY if a part of the question asks about a kind of subject such as "practical subjects" or "theory papers", otherwise use null — never invent one):
${subjectTypeList}

Known subject departments actually used in the database — a separate list from the departments above, used ONLY for the "subject" topic's "subjectDepartmentQuery" (copy one EXACTLY if a part of the question scopes subjects to one of these, otherwise use null — never invent one):
${subjectDepartmentList}

Recent conversation (use this to resolve pronouns like "her"/"his"/"its"
and short follow-ups like "and the HOD?", "code of cse" or "and its syllabus" into full,
self-contained requests — the student is continuing the same
conversation, not starting over each time):
${formatHistory(history)}

New student question (may be in English, Hindi, Hinglish, misspelled, or abbreviated):
"""${question}"""

Respond with ONLY a single JSON object, no prose, no markdown fences, in exactly this shape:
{

  "requests": [
    {
      "topic": "department" | "faculty" | "event" | "aboutUs" | "facility" | "subject" | "academic",
      "departmentCode": string or null,
      "facultyNameQuery": string or null,
      "designationQueries": [string, ...] or [],
      "facilityCategoryQuery": string or null,
      "facilityNameQuery": string or null,
      "subjectNameQuery": string or null,
      "subjectTypeQuery": string or null,
      "subjectDepartmentQuery": string or null
    }
  ],
  "isGreetingOrSmallTalk": true or false
}

Rules:
- Include one object in "requests" per distinct thing being asked about. A question about just one thing gets exactly one entry. A purely greeting/small-talk message with no factual request gets an empty "requests" array.
- "departmentCode" must be exactly one of the codes listed above, or null. Use it for the "department", "faculty", and "facility" topics only — NOT for "subject".
- "facultyNameQuery" is the name (full or partial, title like "Prof."/"Dr." removed) of a SPECIFIC person, or null if that part of the question is about a role/group rather than one named person.
- "designationQueries" must be an array containing only exact designation values from the list above. Include all relevant designations when the question asks about multiple roles or a group matching multiple roles. Return an empty array if no designation applies. Only set this for a role/title/group question, not a named individual.
- "facilityCategoryQuery" must be exactly one of the facility categories listed above, or null. Only set this when the question is about a CATEGORY of facility (e.g. "labs", "hostels"), not one specific named facility.
- "facilityNameQuery" is the name (full or partial) of a SPECIFIC named facility (e.g. "Central Library", "Boys Hostel A"), or null if the question is about a category/group instead.
- "subjectNameQuery" is the name (full or partial) of a SPECIFIC subject (e.g. "Data Structures"), or null if the question is about subjects in general (of a department or type).
- "subjectTypeQuery" must be exactly one of the subject types listed above, or null.
- "subjectDepartmentQuery" must be exactly one of the subject departments listed above, or null. Use this (not "departmentCode") to scope the "subject" topic to a department.
- "isGreetingOrSmallTalk" is true only for greetings, thanks, goodbyes, or similar small talk with no factual request.
- If the new question is a short follow-up ("her designation", "and hod", "what about me", "what's its capacity", "and its syllabus", "the practical ones?"), reuse the department/person/designation/facility/subject/topic from the conversation above rather than returning an empty "requests" array.
`;

    const response = await gemini.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt
    });

    return parseClassification(response.text, validDepartmentCodes, validDesignations, validFacilityCategories, validSubjectTypes, validSubjectDepartments);

};



module.exports = { classifyQuestion };
