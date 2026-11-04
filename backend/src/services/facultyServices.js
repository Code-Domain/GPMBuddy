const mongoose = require("mongoose");

const Faculty = require("../models/faculty");
const departmentServices = require("../services/departmentServices");
const ApiError = require("../utils/ApiError");


const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


const normalizeStringArray = (rawValue, fieldName) => {
    let values = rawValue;

    // Parse JSON strings received through FormData
    if (typeof values === "string") {
        try {
            values = JSON.parse(values);
        } catch {
            throw new ApiError(400, `Invalid ${fieldName} format!`);
        }
    }

    if (!Array.isArray(values)) {
        throw new ApiError(400, `${fieldName} must be an array!`);
    }

    const result = [];

    for (const raw of values) {
        if (typeof raw !== "string") continue;

        let value = raw.trim();

        if (!value) continue;

        // Repair an array that was previously stored as a JSON string
        if (value.startsWith("[") && value.endsWith("]")) {
            try {
                const parsed = JSON.parse(value);

                if (Array.isArray(parsed)) {
                    for (const item of parsed) {
                        if (typeof item === "string" && item.trim()) {
                            result.push(item.trim());
                        }
                    }
                    continue;
                }
            } catch {
                // Keep it as a normal string if it is not valid JSON.
            }
        }

        result.push(value);
    }

    return result;
};


// Trims each entry and drops duplicates/empties — same pattern used
// for qualification/specialization and for subjects' type/departments
// arrays elsewhere in this project.


const normalizeDesignations = (rawList) => {
    const designations = normalizeStringArray(
        rawList,
        "designations"
    );

    const seen = new Set();
    const result = [];

    for (const raw of designations) {
        const value = raw.trim();
        const normalizedValue = value.toLowerCase();

        if (!seen.has(normalizedValue)) {
            seen.add(normalizedValue);
            result.push(value);
        }
    }

    if (result.length === 0) {
        throw new ApiError(
            400,
            "At least one valid designation is required!"
        );
    }

    return result;
};


// A profileImage is only ever valid as a complete pair — contentType
// with no real image bytes is exactly the broken state that causes
// getFacultyImage to 404 while the faculty record otherwise looks
// fine. This guards against that ever being written again, from any
// entry point (not just the admin panel's own upload flow).
const assertValidProfileImage = (profileImage) => {

    if (profileImage === undefined) {
        return;
    }

    const hasData = Buffer.isBuffer(profileImage?.data) && profileImage.data.length > 0;
    const hasContentType = !!profileImage?.contentType;

    if (hasContentType !== hasData) {
        throw new ApiError(400, "profileImage must include both real image data and a contentType together, or neither.");
    }
};


exports.createFaculty = async (body) => {

    assertValidProfileImage(body.profileImage);

    let departmentId = null;

    if (body.department) {
        const department = await departmentServices.findDepartment(body.department);
        departmentId = department._id;
    }

    const faculty = await Faculty.create({
        name: body.name,
        department: departmentId,
        designations: normalizeDesignations(body.designations),
        qualification: normalizeStringArray(body.qualification || [],"qualification"),
        specialization: normalizeStringArray(body.specialization || [],"specialization"),
        phone: body.phone || "",
        office: body.office || "",
        // body.profileImage is { data: Buffer, contentType: string },
        // built by the controller from the uploaded file — this
        // service never deals with raw multipart data, only the
        // shape the schema expects.
        profileImage: body.profileImage || undefined,
        bio: body.bio || "",
        joiningYear: body.joiningYear
    });


    return await faculty.populate("department", "name code");
};


exports.getFaculties = async () => {

    // profileImage.data is select: false on the schema, so this
    // already excludes the image bytes — the list response only ever
    // carries profileImage.contentType (useful for the frontend to
    // know whether to render an <img> at all).
    return await Faculty.find()
        .populate("department", "name code")
        .sort({ name: 1 });
};


exports.getDesignations = async () => {

    // distinct() on an array field returns each unique ELEMENT across
    // all documents (not the arrays themselves), so this yields the
    // atomic tags — "Lecturer", "Selection Grade", "HOD", etc. — which
    // is exactly what the chatbot classifier grounds against.
    return await Faculty.distinct("designations");
};


exports.searchFaculty = async (body) => {

    const filter = {};

    if (body.department) {
        const department = await departmentServices.findDepartment(body.department);
        filter.department = department._id;
    }


    if (Array.isArray(body.designations) && body.designations.length) {

        // "Does the faculty member's designations array contain ANY of
        // these tags" — standard Mongo array-field behaviour for $in.
        // Because each tag is atomic ("Lecturer", "Selection Grade",
        // "HOD"), a search for "Lecturer" automatically includes
        // someone tagged ["Lecturer", "Selection Grade"] or
        // ["Lecturer", "HOD"] — no compound-string parsing needed —
        // while "Professor" still correctly excludes "Assistant
        // Professor", since that's stored as its own separate tag.
        // Case-insensitive exact match per tag, same convention as
        // every other grounded string field in this project.
        filter.designations = {
            $in: body.designations
                .map(designation => designation.trim())
                .filter(Boolean)
                .map(designation => new RegExp(`^${escapeRegex(designation)}$`, "i"))
        };
    }



    if (body.search) {
        const search = body.search.trim();

        if (search) {
            filter.name = {
                $regex: escapeRegex(search),
                $options: "i"
            };
        }
    }


    return await Faculty.find(filter)
        .populate("department", "name code")
        .sort({ name: 1 });
};


exports.getFacultyById = async (params) => {

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        throw new ApiError(400, "Invalid faculty ID!");
    }

    return await Faculty.findById(params.id).populate("department", "name code");
};


// Explicitly opts back IN to the image bytes (which select: false
// hides everywhere else) — this is the ONLY place in the codebase
// that should ever load profileImage.data, since it's the one route
// actually streaming it to a browser.
exports.getFacultyImage = async (params) => {

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        throw new ApiError(400, "Invalid faculty ID!");
    }

    const faculty = await Faculty.findById(params.id).select("+profileImage.data");

    if (!faculty) {
        throw new ApiError(404, "Faculty not found!");
    }

    if (!faculty.profileImage || !faculty.profileImage.data) {
        throw new ApiError(404, "This faculty member has no profile image!");
    }

    return faculty.profileImage;
};


exports.updateFaculty = async (req) => {

    const { id } = req.params;
    const body = req.body;

    assertValidProfileImage(body.profileImage);


    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid faculty ID!");
    }


    const faculty = await Faculty.findById(id);

    if (!faculty) {
        throw new ApiError(404, "Faculty not found!");
    }



    if (body.name !== undefined) {
        faculty.name = body.name;
    }

    // Sending designations (replaces the whole list) — must still
    // leave at least one tag; the schema validator rejects an empty
    // array on save, so a faculty member can never end up with none.
    if (body.designations !== undefined) {
        faculty.designations = normalizeDesignations(body.designations);
    }

    if (body.qualification !== undefined) {
        faculty.qualification= normalizeStringArray(body.qualification || [],"qualification")
    }

    if (body.specialization !== undefined) {
        faculty.specialization = normalizeStringArray(body.specialization || [],"specialization");
    }

    if (body.phone !== undefined) {
        faculty.phone = body.phone;
    }

    if (body.office !== undefined) {
        faculty.office = body.office;
    }

    // Only overwritten when a new file was actually uploaded (the
    // controller only sets body.profileImage in that case) — updating
    // other fields never silently wipes the existing photo.
    if (body.profileImage !== undefined) {
        faculty.profileImage = body.profileImage;
    }

    if (body.bio !== undefined) {
        faculty.bio = body.bio;
    }

    if (body.joiningYear !== undefined) {
        faculty.joiningYear = body.joiningYear;
    }

    if (body.department !== undefined) {

        const department = await departmentServices.findDepartment(body.department);

        faculty.department = department._id;
    }


    await faculty.save();

    return await faculty.populate("department", "name code");
};


exports.deleteFaculty = async (params) => {

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        throw new ApiError(400, "Invalid faculty ID!");
    }

    const faculty = await Faculty.findOneAndDelete({
        _id: params.id
    }).populate("department", "name code");

    if (!faculty) {
        throw new ApiError(404, "Faculty not found!");
    }

    return faculty;
};