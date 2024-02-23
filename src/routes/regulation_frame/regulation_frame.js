const express = require("express");

const academic_year_dropdown = require("../../controllers/regulation_frame/dropdown/academic_year");
const department_dropdown = require("../../controllers/regulation_frame/dropdown/department");
const regulation_dropdown = require("../../controllers/regulation_frame/dropdown/regulation");
const semester_dropdown = require("../../controllers/regulation_frame/dropdown/semester");
const branch_dropdown = require("../../controllers/regulation_frame/dropdown/branch");
const degree_dropdown = require("../../controllers/regulation_frame/dropdown/degree")
const course_dropdown = require("../../controllers/regulation_frame/dropdown/course")

const router = express.Router();

//dropdown routes
router.get("/dropdown/regulation", regulation_dropdown.get_regulation);
router.get("/dropdown/branch", branch_dropdown.get_branch);
router.get("/dropdown/academic-years", academic_year_dropdown.get_academic_years);
router.get("/dropdown/department", department_dropdown.get_department);
router.get("/dropdown/semester", semester_dropdown.get_semester);
router.get("/dropdown/degree", degree_dropdown.get_degree)
router.get("/dropdown/course",  course_dropdown.get_courses)

module.exports = router;
