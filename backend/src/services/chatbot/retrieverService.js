const departmentServices = require("../departmentServices");
const facultyServices = require("../facultyServices");
const aboutUsServices = require("../aboutUsServices");
const facilityServices = require("../facilityServices");
const subjectServices = require("../subjectServices");
const Event = require("../../models/event");

// Long syllabus lists for dozens of subjects would bloat the answer
// prompt for no benefit, so once a result set is larger than this the
// syllabus is dropped. Narrow queries (a specific subject, one
// department's subjects) usually stay under the limit and keep it.
const MAX_SUBJECTS_WITH_SYLLABUS = 8;

// A subject with an empty "departments" array is common to every
// department, so it's labelled explicitly instead of leaving the
// answer step to guess what an empty array means.
const prepareSubjects = (subjects) => {

    const dropSyllabus = subjects.length > MAX_SUBJECTS_WITH_SYLLABUS;

    return subjects.map(subject => {

        const plain = typeof subject.toObject === "function" ? subject.toObject() : { ...subject };

        plain.departments = plain.departments && plain.departments.length
            ? plain.departments
            : ["All departments"];

        if (dropSyllabus) {
            delete plain.syllabus;
        }

        return plain;
    });
};

// Fetches real data for ONE classified request, using the project's
// existing CRUD services only. Returns null when nothing relevant
// exists, so the response layer can say so instead of guessing.
const retrieveOne = async (request) => {

    const {
        topic,
        departmentCode,
        facultyNameQuery,
        designationQuery,
        facilityCategoryQuery,
        facilityNameQuery,
        subjectNameQuery,
        subjectTypeQuery,
        subjectDepartmentQuery
    } = request;

    switch (topic) {

        case "department":
            return departmentCode
                ? await departmentServices.findDepartment(departmentCode)
                : await departmentServices.getDepartments();

        case "faculty": {
            // facultyServices.searchFaculty combines name (partial
            // match), department, and designation (exact match)
            // filters together — e.g. "principal of mechanical
            // department" uses department + designation at once.
            if (facultyNameQuery || departmentCode || designationQuery) {
                return await facultyServices.searchFaculty({
                    search: facultyNameQuery || undefined,
                    department: departmentCode || undefined,
                    designation: designationQuery || undefined
                });
            }

            return await facultyServices.getFaculties();
        }

        case "event":
            return await Event.find().sort({ date: 1 });

        case "aboutUs":
            // Singleton document, no filters needed.
            return await aboutUsServices.getAboutUs();

        case "facility": {
            // facilityServices.searchFacilities combines name (partial
            // match), category, and department filters together —
            // e.g. "labs in the CSE department" uses category +
            // department at once.
            if (facilityNameQuery || facilityCategoryQuery || departmentCode) {
                return await facilityServices.searchFacilities({
                    search: facilityNameQuery || undefined,
                    category: facilityCategoryQuery || undefined,
                    department: departmentCode || undefined
                });
            }

            return await facilityServices.getFacilities();
        }

        case "subject": {
            // subjectServices.searchSubjects combines name, department,
            // and type filters together — e.g. "practical subjects of
            // the CSE department". Note: subject departments use
            // subjectDepartmentQuery, a separate grounded field from
            // departmentCode — see classifierService.js.
            const hasFilter = subjectNameQuery || subjectTypeQuery || subjectDepartmentQuery;

            const subjects = hasFilter
                ? await subjectServices.searchSubjects({
                    search: subjectNameQuery || undefined,
                    department: subjectDepartmentQuery || undefined,
                    type: subjectTypeQuery || undefined
                })
                : await subjectServices.getSubjects();

            return prepareSubjects(subjects);
        }

        default:
            return null;
    }
};

// A question can ask about several things at once (e.g. "the
// principal and the college name"); classifierService breaks it into
// one request per distinct thing, and this fetches each one
// independently, in parallel.
const retrieveData = async (requests) => {

    return await Promise.all(
        requests.map(async request => ({
            topic: request.topic,
            data: await retrieveOne(request)
        }))
    );
};

// Scans the already-retrieved results for real, existing images
// (a faculty member's uploaded photo, a facility's image URL) and
// returns them as a flat, vetted list. This is the ONLY source the
// answer step is allowed to pull an image URL from — it never lets
// the model type out a URL itself, the same "ground real data, don't
// trust free text" rule used everywhere else in this pipeline.
const collectImageCandidates = (results) => {

    const candidates = [];

    for (const result of results) {

        const items = Array.isArray(result.data)
            ? result.data
            : (result.data ? [result.data] : []);

        for (const item of items) {

            if (result.topic === "faculty" && item?._id && item?.profileImage?.contentType) {
                candidates.push({
                    label: `Photo of ${item.name}`,
                    url: `/faculty/id/${item._id}/image`
                });
            }

            if (result.topic === "facility" && Array.isArray(item?.images) && item.images.length) {
                candidates.push({
                    label: `Photo of ${item.name}`,
                    url: item.images[0]
                });
            }
        }
    }

    return candidates;
};

module.exports = { retrieveData, collectImageCandidates };