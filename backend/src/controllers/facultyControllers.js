const facultyServices = require("../services/facultyServices");
const success = require("../utils/successResponseUtil");
const ApiError = require("../utils/ApiError");

exports.getFaculties = async (req, res) => {
    const data = await facultyServices.getFaculties();
    success(res, 200, "Faculty found", data);
}

exports.getFacultyById = async (req, res) => {
    const data = await facultyServices.getFacultyById(req.params);
    if (!data) {
        throw new ApiError(404, "Faculty not found!");
    }
    success(res, 200, "Faculty found", data);
}

// Streams the raw image bytes straight from MongoDB — NOT wrapped in
// the usual { success, message, data } JSON envelope, because this
// response IS the image (an <img src="/api/faculty/:id/image"> tag
// points directly at this route).
exports.getFacultyImage = async (req, res) => {
    const image = await facultyServices.getFacultyImage(req.params);

    res.set("Content-Type", image.contentType);
    // Browsers/CDNs cache this for a day — compensates for the fact
    // that, unlike a static file server, MongoDB itself has no
    // built-in HTTP caching.
    res.set("Cache-Control", "public, max-age=86400");
    res.send(image.data);
}

exports.searchFaculty = async (req, res) => {
    const data = await facultyServices.searchFaculty(req.body);
    success(res, 200, "Faculty found", data);
};

exports.createFaculty = async (req, res) => {

    // multer (memory storage) put the uploaded file on req.file as
    // raw bytes — convert that into the { data, contentType } shape
    // the schema/service expect. The admin never sees or sets a URL;
    // they just picked a file.
    if (req.file) {
        req.body.profileImage = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
    }

    const createdFaculty = await facultyServices.createFaculty(req.body);
    if (!createdFaculty) {
        throw new ApiError(400, "Faculty not created!");
    }
    success(res, 201, "Faculty created successfully", createdFaculty);
}

exports.updateFaculty = async (req, res) => {

    if (req.file) {
        req.body.profileImage = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
    }
    // If no new file was uploaded, body.profileImage stays undefined,
    // and facultyServices.updateFaculty leaves the existing photo
    // untouched — editing a faculty member's phone number, say,
    // never accidentally wipes their photo.

    const updatedFaculty = await facultyServices.updateFaculty(req);
    if (!updatedFaculty) {
        throw new ApiError(400, "Faculty not updated!");
    }
    success(res, 200, "Faculty updated successfully", updatedFaculty);
}

exports.deleteFaculty = async (req, res) => {
    const deletedFaculty = await facultyServices.deleteFaculty(req.params);
    if (!deletedFaculty) {
        throw new ApiError(400, "Faculty not deleted!");
    }
    success(res, 200, "Faculty deleted successfully", deletedFaculty);
}