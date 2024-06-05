const express = require("express");

const academic_year_dropdown = require("../../controllers/regulation_frame/dropdown/academic_year");
const department_dropdown = require("../../controllers/regulation_frame/dropdown/department");
const regulation_dropdown = require("../../controllers/regulation_frame/dropdown/regulation");
const semester_dropdown = require("../../controllers/regulation_frame/dropdown/semester");
const branch_dropdown = require("../../controllers/regulation_frame/dropdown/branch");
const degree_dropdown = require("../../controllers/regulation_frame/dropdown/degree");
const course_dropdown = require("../../controllers/regulation_frame/dropdown/course");
const course_category_dropdown  =require("../../controllers/regulation_frame/dropdown/course_category")

const main_regulation = require("../../controllers/regulation_frame/main/regulation")
const main_degree = require("../../controllers/regulation_frame/main/degree")
const main_branch = require("../../controllers/regulation_frame/main/branch")
const main_course = require("../../controllers/regulation_frame/main/course")
const main_course_objective = require("../../controllers/regulation_frame/main/course_objective")
const main_co_po_mapping = require("../../controllers/regulation_frame/main/co_po_mapping")
const main_course_category = require("../../controllers/regulation_frame/main/course_category")
const main_course_unit = require("../../controllers/regulation_frame/main/course_unit")
const main_course_outcome = require("../../controllers/regulation_frame/main/course_outcome")
const main_po_pso = require("../../controllers/regulation_frame/main/po_pso")


const router = express.Router();

//dropdown routes related to regulation
router.get("/dropdown/regulation", regulation_dropdown.get_regulation);
router.get("/dropdown/branch", branch_dropdown.get_branch);
router.get("/dropdown/academic-years",academic_year_dropdown.get_academic_years);
router.get("/dropdown/department", department_dropdown.get_department);
router.get("/dropdown/semester", semester_dropdown.get_semester);
router.get("/dropdown/degree", degree_dropdown.get_degree);
router.get("/dropdown/course", course_dropdown.get_courses);
router.get("/dropdown/course-category", course_category_dropdown.get_course_category)

//main routes in regulation framing 
router.post("/regulation", main_regulation.post_regulation);
router.put("/regulation", main_regulation.update_regulation);
router.delete("/regulation", main_regulation.delete_regulation);

router.post("/degree", main_degree.post_degree);
router.put("/degree", main_degree.update_degree);
router.delete("/degree", main_degree.delete_degree);

router.post("/branch", main_branch.post_branch);
router.put("/branch", main_branch.update_branch);
router.delete("/branch", main_branch.delete_branch);

router.post("/course", main_course.post_course);
router.put("/course", main_course.update_course);
router.delete("/course", main_course.delete_course);

router.get("/course-objective", main_course_objective.get_course_objective)
router.post("/course-objective", main_course_objective.post_course_objective)
router.put("/course-objective", main_course_objective.update_course_objective)
router.delete("/course-objective", main_course_objective.delete_course_objective)

router.post("/course-category", main_course_category.post_course_category)


router.get("/course-unit", main_course_unit.get_course_unit)
router.post("/course-unit", main_course_unit.post_course_unit)
router.put("/course-unit", main_course_unit.update_course_unit)
router.delete("/course-unit", main_course_unit.delete_course_unit)

router.get("/course-outcome", main_course_outcome.get_course_outcome)
router.post("/course-outcome", main_course_outcome.post_course_outcome)
router.put("/course-outcome", main_course_outcome.update_course_outcome)
router.delete("/course-outcome", main_course_outcome.delete_course_outcome)


router.get("/po-pso", main_po_pso.get_po_pso)
router.post("/po-pso", main_po_pso.post_po_pso)
router.put("/po-pso", main_po_pso.update_po_pso)
router.delete("/po-pso", main_po_pso.delete_po_pso)


router.get("/co-po-mapping", main_co_po_mapping.get_co_po_mapping)
router.post("/co-po-mapping", main_co_po_mapping.post_co_po_mapping )
module.exports = router;
