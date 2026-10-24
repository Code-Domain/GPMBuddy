
const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "department",
      required: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    qualification: {
      type: [String],
      default: [],
    },

    specialization: {
      type: [String],
      default: [],
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    office: {
      type: String,
      trim: true,
      default: "",
    },

    // The actual image bytes live here, directly in MongoDB (Atlas
    // storage persists; this server's own filesystem does not). The
    // `data` subfield is select: false so it's excluded from normal
    // queries by default (getFaculties/getFacultyById) — it's only
    // loaded explicitly, by the one route that serves the image
    // itself (see facultyServices.getFacultyImage).
    profileImage: {
      data: {
        type: Buffer,
        select: false,
      },
      contentType: {
        type: String,
        default: "",
      },
    },

    bio: {
      type: String,
      trim: true,
      default: "",
    },

    joiningYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear(),
    },
  },
  {
    timestamps: true,
  }
);

facultySchema.index({ name: 1 });
facultySchema.index({ department: 1 });
facultySchema.index({ designation: 1 });

module.exports = mongoose.model("faculty", facultySchema);