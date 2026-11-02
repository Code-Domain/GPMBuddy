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

    // An array, not a single string, because a faculty member can
    // hold several independent, orthogonal roles at once: a base rank
    // ("Lecturer", "Professor"), a grade/level modifier ("Selection
    // Grade"), and/or an additional charge ("HOD", "Principal") — e.g.
    // ["Lecturer", "Selection Grade"] or ["Lecturer", "HOD"]. Storing
    // these as separate atomic tags means "find all Lecturers" or
    // "find all HODs" is a simple array-contains check, with no need
    // to parse or semantically reason about compound strings like
    // "Lecturer (Selection Grade)" or "Lecturer cum HOD".
    designations: {
      type: [String],
      required: true,
      validate: {
        validator: value => Array.isArray(value) && value.length > 0,
        message: "At least one designation is required!"
      }
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
facultySchema.index({ designations: 1 });

module.exports = mongoose.model("faculty", facultySchema);