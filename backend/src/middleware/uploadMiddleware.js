const multer = require("multer");
const ApiError = require("../utils/ApiError");

const MAX_IMAGE_SIZE_BYTES = 300 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Memory storage, not disk storage: the file never touches the
// server's filesystem, it arrives as req.file.buffer. That's the
// whole point — this app's filesystem is ephemeral (hosted
// elsewhere, wiped on redeploy), but MongoDB Atlas storage persists,
// so the image bytes go straight into the database instead.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(new ApiError(400, "Only JPEG, PNG, or WEBP images are allowed!"));
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_IMAGE_SIZE_BYTES }
});

// req.file.fieldname === fieldName after this runs; req.file.buffer
// and req.file.mimetype are what the controller turns into the
// stored { data, contentType } shape.
const createImageUploader = (fieldName) => upload.single(fieldName);

module.exports = { createImageUploader, MAX_IMAGE_SIZE_BYTES };