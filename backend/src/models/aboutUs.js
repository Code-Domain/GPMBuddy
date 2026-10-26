const mongoose = require("mongoose");

const aboutUsModel = new mongoose.Schema(
  {
    history: {
      type: String,
      required: true,
      trim: true,
    },

    vision: {
      type: String,
      required: true,
      trim: true,
    },

    mission: [
          {
            type: String,
            required: true,
            trim: true
          },
    ],


    principalMessage: {
      type: String,
      required: true,
      trim: true,
    },

    principal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "faculty",
      required: true,
    },

    achievements: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },

        description: {
          type: String,
          trim: true,
        },

        year: {
          type: Number,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("aboutUs", aboutUsModel);