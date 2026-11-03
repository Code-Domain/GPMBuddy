const express = require("express");
const router = express.Router();

const academicController = require("../controllers/academicControllers");
const authenticate = require("../middleware/authenticateMiddlewares");

router.get("/", academicController.getAcademicInfo);
router.put("/", authenticate, academicController.updateAcademicInfo);

module.exports = router;
