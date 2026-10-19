const express = require("express");
const router = express.Router();

const departmentControllers = require("../controllers/departmentControllers");
const authenticate = require("../middleware/authenticateMiddlewares");

router.get("/",  departmentControllers.getDepartments);
router.get("/find/:departmentInput", departmentControllers.findDepartment);
router.get("/id/:id", departmentControllers.getDepartmentsById);
// router.get("/name/:name", departmentControllers.getDepartmentsByName);
// router.get("/code/:code", departmentControllers.getDepartmentsByCode);

router.post("/", authenticate, departmentControllers.createDepartments);

router.put("/:id", authenticate, departmentControllers.updateDepartments);

router.delete("/:id", authenticate, departmentControllers.deleteDepartments);  

module.exports= router;