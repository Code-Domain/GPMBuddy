const mongoose = require("mongoose");

const departmentModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    intake: {
      type: Number,
    },

    headOfDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "faculty",
    },

    vision: {
      type: String,
      trim: true,
    },

    mission: [
          {
            type: String,
            required: true,
            trim: true
          },
    ],

    peo: [
          {
            type: String,
            required: true,
            trim: true
          },
    ],

    po: [
          {
            type: String,
            required: true,
            trim: true
          },
    ],

    pso: [
          {
            type: String,
            required: true,
            trim: true
          },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("department", departmentModel);