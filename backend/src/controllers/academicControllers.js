const academicService = require("../services/academicServices");
const success = require("../utils/successResponseUtil");
const ApiError = require("../utils/ApiError");


exports.getAcademicInfo = async (req, res) => {
    const academicInfo = await academicService.getAcademicInfo();
    if (!academicInfo) {
      success(res, 200, "Academic information is not available.");
    }

    success(res, 200, "Academic Info Fetched Successfully", academicInfo);
};

exports.updateAcademicInfo = async (req, res) => {
    const allowedFields = [
      "admission",
      "registration",
      "enrollment",
      "examination",
      "officialLinks",
    ];

    const data = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        data[field] = req.body[field];
      }
    }

    if (Object.keys(data).length === 0) {
      throw new ApiError(400, "No valid academic information was provided.");
    }

    const academicInfo = await academicService.upsertAcademicInfo(data);

    success(res, 200, "Academic information saved successfully.", academicInfo);
};

