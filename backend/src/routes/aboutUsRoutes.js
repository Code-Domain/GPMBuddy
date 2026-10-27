const express = require("express");
const router = express.Router();

const aboutUsControllers = require("../controllers/aboutUsControllers");
const authenticate = require("../middleware/authenticateMiddlewares");

router.get("/", aboutUsControllers.getAboutUs);

router.post("/create", authenticate, aboutUsControllers.createAboutUs); 

router.put("/update/:id", authenticate, aboutUsControllers.updateAboutUs);

module.exports= router;