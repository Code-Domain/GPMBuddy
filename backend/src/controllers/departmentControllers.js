const departmentServices = require("../services/departmentServices");
const success = require("../utils/successResponseUtil");
const ApiError = require("../utils/ApiError");

exports.getDepartments = async (req, res) => {
    const data = await departmentServices.getDepartments();
    success(res, 200, "Department found", data);
}

exports.getDepartmentsById = async (req, res) => {
    const data = await departmentServices.getDepartmentsById(req.params);
    if (!data) {
        throw new ApiError(404, "Department not found!");
    }
    success(res, 200, "Department found", data);
}

exports.findDepartment = async (req, res) => {
    const data = await departmentServices.findDepartment(req.params.departmentInput);
    if (!data){
        throw new ApiError(404, "Department not found");
    }
    console.log(data)
    success(res, 200, "Department found", data);
}

// exports.getDepartmentsByName = async (req, res) => {
//     const data = await departmentServices.getDepartmentsByName(req.params);
//     if (!data) {
//         throw new ApiError(404, "Department not found!");
//     }
//     success(res, 200, "Department found", data);
// }

// exports.getDepartmentsByCode = async (req, res) => {
//     const data = await departmentServices.getDepartmentsByCode(req.params);
//     if (!data) {
//         throw new ApiError(404, "Department not found!");
//     }
//     success(res, 200, "Department found", data);
// }

exports.createDepartments = async (req, res) => {
    const createdDepartment = await departmentServices.createDepartments(req.body);
    if (!createdDepartment) {
        throw new ApiError(400, "Department not created!");
    }
    success(res, 201, "Department created successfully", createdDepartment);
}

exports.updateDepartments = async (req, res) => {
    const updatedDepartment = await departmentServices.updateDepartments(req);
    if (!updatedDepartment) {
        throw new ApiError(400, "Department not updated!");
    }
    success(res, 200, "Department updated successfully", updatedDepartment);
}

exports.deleteDepartments = async (req, res) => {
    const deletedDepartment = await departmentServices.deleteDepartments(req.params);
    if (!deletedDepartment) {
        throw new ApiError(400, "Department not deleted!");
    }
    success(res, 200, "Department deleted successfully", deletedDepartment);
}