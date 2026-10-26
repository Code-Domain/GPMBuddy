const mongoose = require("mongoose");

const department = require("../models/department");
const faculty = require("../models/faculty");
const facility = require("../models/facility");
const ApiError = require("../utils/ApiError");

const HOD_POPULATE_FIELDS = "name designation profileImage.contentType";


const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


const ensureCodeIsUnique = async (code, excludeId = null) => {

    const filter = {
        code: { $regex: `^${escapeRegex(code.trim())}$`, $options: "i" }
    };

    if (excludeId) {
        filter._id = { $ne: excludeId };
    }

    const existing = await department.findOne(filter);

    if (existing) {
        console.log(existing)
        throw new ApiError(409, "A department with this code already exists!");
    }
};


// Accepts a Faculty ObjectId, or a faculty name (exact, case-insensitive)
// as a convenience for admin forms that don't already have the ID handy.
// Returns null when the input is empty/removed — a department is allowed
// to have no HOD assigned yet.
const resolveHeadOfDepartment = async (input) => {

    if (input === null || input === undefined || input === "") {
        return null;
    }

    if (typeof input === "string" && mongoose.Types.ObjectId.isValid(input) && input.length === 24) {

        const exists = await faculty.exists({ _id: input });

        if (!exists) {
            throw new ApiError(404, "Faculty (head of department) not found!");
        }

        return input;
    }

    if (typeof input !== "string" || !input.trim()) {
        throw new ApiError(400, "Head of department must be a faculty ID or name!");
    }

    const facultyData = await faculty.findOne({
        name: { $regex: `^${escapeRegex(input.trim())}$`, $options: "i" }
    });

    if (!facultyData) {
        throw new ApiError(404, "Faculty (head of department) not found!");
    }

    return facultyData._id;
};


exports.getDepartments = async () => {

    return await department.find()
        .populate("headOfDepartment", HOD_POPULATE_FIELDS)
        .sort({ name: 1 });
};


// A lightweight read used by the chatbot classifier, which fetches
// the department list on EVERY question just to ground name/code
// extraction — .lean() skips hydrating full Mongoose documents, and
// .select() skips the heavier fields (description, PEOs/POs/PSOs,
// etc.) that classification never needs.
exports.getDepartmentCodesAndNames = async () => {

    return await department.find()
        .select("name code")
        .sort({ name: 1 })
        .lean();
};


exports.getDepartmentsById = async (params) => {

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        throw new ApiError(400, "Invalid department ID");
    }

    const departmentData = await department.findById(params.id).populate("headOfDepartment", HOD_POPULATE_FIELDS);

    if(!departmentData){
        throw new ApiError(400, "Department not found");
    }

    const structuredDepartmentData = departmentData.toObject();
    structuredDepartmentData.pso = structuredDepartmentData.pso.map((description, index) => ({
        code : `PSO${index+1}`,
        description: description
    }));
    structuredDepartmentData.po = structuredDepartmentData.po.map((description, index) => ({
        code : `PO${index+1}`,
        description: description
    }));
    structuredDepartmentData.peo = structuredDepartmentData.peo.map((description, index) => ({
        code : `PEO${index+1}`,
        description: description
    }));
    structuredDepartmentData.mission = structuredDepartmentData.mission.map((description, index) => ({
        code : `M${index+1}`,
        description: description
    }));

    return structuredDepartmentData;

};


exports.findDepartment = async (departmentInput) => {

    if (
        !departmentInput ||
        typeof departmentInput !== "string" ||
        !departmentInput.trim()
    ) {
        throw new ApiError(400, "Department is required!");
    }

    const value = departmentInput.trim();

    const departmentData = await department.findOne({
        $or: [
            {
                code: {
                    $regex: `^${escapeRegex(value)}$`,
                    $options: "i"
                }
            },
            {
                name: {
                    $regex: `^${escapeRegex(value)}$`,
                    $options: "i"
                }
            }
        ]
    }).populate("headOfDepartment", HOD_POPULATE_FIELDS);

    if (!departmentData) {
        throw new ApiError(404, "Department not found!");
    }

    const structuredDepartmentData = departmentData.toObject();
    structuredDepartmentData.pso = structuredDepartmentData.pso.map((description, index) => ({
        code : `PSO${index+1}`,
        description: description
    }));
    structuredDepartmentData.po = structuredDepartmentData.po.map((description, index) => ({
        code : `PO${index+1}`,
        description: description
    }));
    structuredDepartmentData.peo = structuredDepartmentData.peo.map((description, index) => ({
        code : `PEO${index+1}`,
        description: description
    }));
    

    return structuredDepartmentData;
};


exports.createDepartments = async (body) => {

    if (!body.code || typeof body.code !== "string" || !body.code.trim()) {
        throw new ApiError(400, "Department code is required!");
    }

    await ensureCodeIsUnique(body.code);

    const headOfDepartment = await resolveHeadOfDepartment(body.headOfDepartment);

    const createdDepartment = await department.create({
        name: body.name,
        code: body.code,
        description: body.description,
        established: body.established,
        intake: body.intake,
        headOfDepartment,
        vision: body.vision,
        mission: body.mission,
        peo: body.peo,
        po: body.po,
        pso: body.pso
    });

    return await createdDepartment.populate("headOfDepartment", HOD_POPULATE_FIELDS);
};


exports.updateDepartments = async (req) => {

    const { id } = req.params;
    const body = req.body;


    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid department ID!");
    }


    const departmentDoc = await department.findById(id);

    if (!departmentDoc) {
        throw new ApiError(404, "Department not found!");
    }


    if (body.name !== undefined) {
        departmentDoc.name = body.name;
    }

    if (body.code !== undefined) {

        if (!body.code || typeof body.code !== "string" || !body.code.trim()) {
            throw new ApiError(400, "Department code cannot be empty!");
        }

        await ensureCodeIsUnique(body.code, departmentDoc._id);

        departmentDoc.code = body.code;
    }

    if (body.description !== undefined) {
        departmentDoc.description = body.description;
    }

    if (body.established !== undefined) {
        departmentDoc.established = body.established;
    }

    if (body.intake !== undefined) {
        departmentDoc.intake = body.intake;
    }

    if (body.vision !== undefined) {
        departmentDoc.vision = body.vision;
    }

    if (body.mission !== undefined) {
        departmentDoc.mission = body.mission;
    }

    // Sending peo/po/pso (including []) replaces the whole list.
    if (body.peo !== undefined) {
        departmentDoc.peo = body.peo;
    }

    if (body.po !== undefined) {
        departmentDoc.po = body.po;
    }

    if (body.pso !== undefined) {
        departmentDoc.pso = body.pso;
    }

    if (body.headOfDepartment !== undefined) {
        departmentDoc.headOfDepartment = await resolveHeadOfDepartment(body.headOfDepartment);
    }


    await departmentDoc.save();

    return await departmentDoc.populate("headOfDepartment", HOD_POPULATE_FIELDS);
};


exports.deleteDepartments = async (params) => {

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        throw new ApiError(400, "Invalid department ID!");
    }

    // Faculty and Facility both hold a required/optional reference to
    // a department. Deleting a department that's still in use would
    // leave those references pointing at nothing, so this blocks the
    // delete instead of silently orphaning them — the admin has to
    // reassign or remove those records first.
    const [facultyCount, facilityCount] = await Promise.all([
        faculty.countDocuments({ department: params.id }),
        facility.countDocuments({ department: params.id })
    ]);

    if (facultyCount > 0 || facilityCount > 0) {
        throw new ApiError(
            409,
            `Cannot delete this department — it is still referenced by ${facultyCount} faculty member(s) and ${facilityCount} facility record(s). Reassign or remove those first.`
        );
    }

    const deletedDepartment = await department.findOneAndDelete({
        _id: params.id
    });

    if (!deletedDepartment) {
        throw new ApiError(404, "Department not found!");
    }

    return deletedDepartment;
};