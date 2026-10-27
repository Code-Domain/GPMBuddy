const mongoose = require("mongoose");

const aboutUs = require("../models/aboutUs");
const faculty = require("../models/faculty");


const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


const resolvePrincipal = async (input) => {

    if (input === null || input === undefined || input === "") {
        return null;
    }

    if (typeof input === "string" && mongoose.Types.ObjectId.isValid(input) && input.length === 24) {

        const exists = await faculty.exists({ _id: input });

        if (!exists) {
            throw new ApiError(404, "Principal not found!");
        }

        return input;
    }

    if (typeof input !== "string" || !input.trim()) {
        throw new ApiError(400, "Principal must be a faculty ID or name!");
    }

    const facultyData = await faculty.findOne({
        name: { $regex: `^${escapeRegex(input.trim())}$`, $options: "i" }
    });

    if (!facultyData) {
        throw new ApiError(404, "Principal not found!");
    }

    return facultyData._id;
};

exports.getAboutUs = async () => {
    return await aboutUs.findOne({ isActive: true }).populate("principal");
}

exports.createAboutUs = async (body) => {
    const principal = await resolvePrincipal(body.principal);
    
        const createdAboutUs = await aboutUs.create({
            history: body.history,
            vision: body.vision,
            mission: body.mission,
            principalMessage: body.principalMessage,
            achievements: body.achievements,
            principal
        });
    
        return await createdAboutUs.populate("principal", "name");
    
};

exports.updateAboutUs = async (req) => {
    return await aboutUs.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'});
}
