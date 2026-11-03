const AcademicInfo = require("../models/academicInfo");


exports.getAcademicInfo = async () => {
  return await AcademicInfo.findOne().lean();
};

exports.getValidAcademicSections = async () => {
  const excludedFields = ["_id", "createdAt", "updatedAt", "__v"];
  const data = await AcademicInfo.findOne().lean();
 const sectionNames = Object.keys(data).filter((key) => !excludedFields.includes(key));

  return sectionNames;
}

// Create or update the single academic information document
exports.upsertAcademicInfo = async (data) => {
  let academicInfo = await AcademicInfo.findOne();

  if (academicInfo) {
    if (data.admission !== undefined) {
      if (data.admission.title !== undefined) {
        academicInfo.admission.title = data.admission.title
      }
      if (data.admission.description !== undefined) {
        academicInfo.admission.description = data.admission.description
      }
      if (data.admission.eligibility !== undefined) {
        academicInfo.admission.eligibility = data.admission.eligibility
      }
      if (data.admission.steps !== undefined) {
        academicInfo.admission.steps = data.admission.steps
      }
      if (data.admission.requiredDocuments !== undefined) {
        academicInfo.admission.requiredDocuments = data.admission.requiredDocuments
      }
      if (data.admission.officialLink !== undefined) {
        academicInfo.admission.officialLink = data.admission.officialLink
      }
      if (data.admission.fees !== undefined) {
        academicInfo.admission.fees = data.admission.fees
      }
    }

    if (data.registration !== undefined) {
      if (data.registration.title !== undefined) {
        academicInfo.registration.title = data.registration.title
      }
      if (data.registration.description !== undefined) {
        academicInfo.registration.description = data.registration.description
      }
      if (data.registration.steps !== undefined) {
        academicInfo.registration.steps = data.registration.steps
      }
      if (data.registration.officialLink !== undefined) {
        academicInfo.registration.officialLink = data.registration.officialLink
      }
      if (data.registration.fees !== undefined) {
        academicInfo.registration.fees = data.registration.fees
      }
    }

    if (data.enrollment !== undefined) {
      if (data.enrollment.title !== undefined) {
        academicInfo.enrollment.title = data.enrollment.title
      }
      if (data.enrollment.description !== undefined) {
        academicInfo.enrollment.description = data.enrollment.description
      }
      if (data.enrollment.steps !== undefined) {
        academicInfo.enrollment.steps = data.enrollment.steps
      }
      if (data.enrollment.officialLink !== undefined) {
        academicInfo.enrollment.officialLink = data.enrollment.officialLink
      }
      if (data.enrollment.fees !== undefined) {
        academicInfo.enrollment.fees = data.enrollment.fees
      }
    }

    if (data.examination !== undefined) {
      if (data.examination.title !== undefined) {
        academicInfo.examination.title = data.examination.title
      }
      if (data.examination.description !== undefined) {
        academicInfo.examination.description = data.examination.description
      }
      if (data.examination.guidelines !== undefined) {
        academicInfo.examination.guidelines = data.examination.guidelines
      }
      if (data.examination.officialLink !== undefined) {
        academicInfo.examination.officialLink = data.examination.officialLink
      }
      if (data.examination.rules !== undefined) {
        academicInfo.examination.rules = data.examination.rules
      }
      if (data.examination.evaluationMethods !== undefined) {
        academicInfo.examination.evaluationMethods = data.examination.evaluationMethods
      }
    }


    if (data.curriculum !== undefined) {
      academicInfo.curriculum = data.curriculum
    }
    if (data.disciplinaryRules !== undefined) {
      academicInfo.disciplinaryRules = data.disciplinaryRules
    }
    if (data.academicCalendar !== undefined) {
      academicInfo.academicCalendar = data.academicCalendar
    }

    await academicInfo.save({returnDocument: 'after'});
  } else {
    academicInfo = await AcademicInfo.create(data);
  }

  return academicInfo ;
};

