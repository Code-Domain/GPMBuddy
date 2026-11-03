
const mongoose = require("mongoose");

const academicInfoSchema = new mongoose.Schema(
  {
    // Admission Process
    admission: {
      title: {
        type: String,
        default: "Admission Process",
      },

      description: {
        type: String,
        default: "",
      },

      eligibility: [
        {
          title: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            default: "",
          },
        },
      ],

      steps: [
        {
          title: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            default: "",
          },
        },
      ],

      requiredDocuments: [String],

      fees: [
        {
        description : String,
        amount: String,
        mode: String,
      },
    ],

      officialLink: {
        type: String,
        default: "",
      },
    },

    // Registration 
    registration: {
      title: {
        type: String,
        default: "Registration Process",
      },
      description: {
        type: String,
        default: "",
      },

      steps: {
        description: {
          type: String,
          default: "",
        },
        officialLink: {
          type: String,
          default: "",
        },
      },

      fees: {
        amount: String,
        mode: String,
      },

      officialLink: {
        type: String,
        default: "",
      },

    },


    // Enrollment
    enrollment: {
      title: {
        type: String,
        default: "Enrollment Process",
      },
      description: {
        type: String,
        default: "",
      },

      steps: {
        description: {
          type: String,
          default: "",
        },
        officialLink: {
          type: String,
          default: "",
        },
      },

      fees: {
        amount: String,
        mode: String,
      },

      officialLink: {
        type: String,
        default: "",
      },

    },

    // Examination and Evaluation Guidelines
    examination: {
      title: {
        type: String,
        default: "Examination and Evaluation",
      },

      description: {
        type: String,
        default: "",
      },

      guidelines: [
        {
          title: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            default: "",
          },
        },
      ],

      evaluationMethods: [
        {
          title: String,
          description: String,
        },
      ],

      rules: [
        {
          title: String,
          description: String,
        },
      ],

      officialLink: {
        type: String,
        default: "",
      },
    },

    // Links to official institutional resources

    curriculum: {
      type: String,
      default: "",
    },

    disciplinaryRules: {
      type: String,
      default: "",
    },

    academicCalendar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AcademicInfo", academicInfoSchema);
