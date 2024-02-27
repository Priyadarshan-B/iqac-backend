const express = require("express");

const faculty_dropdown = require("../../controllers/course_faculty_mapping/dropdown/faculty");
const main_faculty_mapping = require("../../controllers/course_faculty_mapping/main/map_faculty");

const router = express.Router();


//dropdown routes
router.get("/dropdown/faculty", faculty_dropdown.get_faculty);


//faculty mapping routes
router.get("/faculty-mapping", main_faculty_mapping.get_mapped_faculty);
router.post("/faculty-mapping", main_faculty_mapping.post_faculty_mapping);
router.put("/faculty-mapping", main_faculty_mapping.update_faculty_mapping);
router.delete("/faculty-mapping", main_faculty_mapping.delete_faculty_mapping);

module.exports = router;
