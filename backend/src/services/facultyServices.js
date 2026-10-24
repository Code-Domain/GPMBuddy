const mongoose = require("mongoose");

const Faculty = require("../models/faculty");
const departmentServices = require("../services/departmentServices");
const ApiError = require("../utils/ApiError");


const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


exports.createFaculty = async (body) => {

    let departmentId = null;

    if (body.department) {
        const department = await departmentServices.findDepartment(body.department);
        departmentId = department._id;
    }

    const faculty = await Faculty.create({
        name: body.name,
        department: departmentId,
        designation: body.designation,
        qualification: body.qualification || [],
        specialization: body.specialization || [],
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

    return await Faculty.distinct("designation");
};


exports.searchFaculty = async (body) => {

    const filter = {};

    if (body.department) {
        const department = await departmentServices.findDepartment(body.department);
        filter.department = department._id;
    }


    if (body.designation) {
        const designation = body.designation.trim();

        if (designation) {
            filter.designation = {
                $regex: `^${escapeRegex(designation)}$`,
                $options: "i"
            };
        }
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

    if (body.designation !== undefined) {
        faculty.designation = body.designation;
    }

    if (body.qualification !== undefined) {
        faculty.qualification = body.qualification;
    }

    if (body.specialization !== undefined) {
        faculty.specialization = body.specialization;
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