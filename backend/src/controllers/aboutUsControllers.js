const aboutUsServices = require("../services/aboutUsServices");
const success = require("../utils/successResponseUtil");
const ApiError = require("../utils/ApiError");

exports.getAboutUs = async (req, res) => {
    const data = await aboutUsServices.getAboutUs();
    success(res, 200, "About Us found", data);
}

exports.createAboutUs = async (req, res) => {
    const createdAboutUs = await aboutUsServices.createAboutUs(req.body); 
    if(!createdAboutUs){
        throw new ApiError(400, "About not created!");
    }
    success(res, 201, "About created successfully", createdAboutUs);
}

exports.updateAboutUs = async (req, res) => {
    const updatedAboutUs = await aboutUsServices.updateAboutUs(req);
    if(!updatedAboutUs){
        throw new ApiError(400, "About Us not updated!");
    }
    success(res, 200, "About Us updated successfully", updatedAboutUs);
}
