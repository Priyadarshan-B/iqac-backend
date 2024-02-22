const express = require("express");

const academic_year_controller = require("../../controllers/regulation_frame/dropdown/academic_year");
const department_controller = require("../../controllers/regulation_frame/dropdown/department");
const regulation_controller = require("../../controllers/regulation_frame/dropdown/regulation");
const semester_controller = require("../../controllers/regulation_frame/dropdown/semester");
const branch_controller = require("../../controllers/regulation_frame/dropdown/branch");
const degree_controller = require("../../controllers/regulation_frame/dropdown/degree")

const router = express.Router();
router.get("/regulation", regulation_controller.get_regulation);
router.get("/branch", branch_controller.get_branch);
router.get("/academic_years", academic_year_controller.get_academic_years);
router.get("/department", department_controller.get_department);
router.get("/semester", semester_controller.get_semester);
router.get("/degree", degree_controller.get_degree)

module.exports = router;
