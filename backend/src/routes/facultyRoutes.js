
const express = require("express");
const router = express.Router();

const facultyControllers = require("../controllers/facultyControllers");
const authenticate = require("../middleware/authenticateMiddlewares");
const { createImageUploader } = require("../middleware/uploadMiddleware");

const uploadFacultyImage = createImageUploader("profileImage");

router.get("/", facultyControllers.getFaculties);
router.get("/id/:id", facultyControllers.getFacultyById);
router.get("/id/:id/image", facultyControllers.getFacultyImage);
router.post("/create/", authenticate, uploadFacultyImage, facultyControllers.createFaculty);
router.put("/update/:id", authenticate, uploadFacultyImage, facultyControllers.updateFaculty);
router.delete("/delete/:id", authenticate, facultyControllers.deleteFaculty);

module.exports = router;