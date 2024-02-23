const express = require("express");

const faculty_dropdown = require("../../controllers/course_faculty_mapping/dropdown/faculty");
const mapping_function = require("../../controllers/course_faculty_mapping/mapping_function/map_faculty");

const router = express.Router();

router.get("/dropdown/faculty", faculty_dropdown.get_faculty);

router.get("/faculty-mapping", mapping_function.get_mapped_faculty);
router.post("/faculty-mapping", mapping_function.post_faculty_mapping);
router.put("/faculty-mapping", mapping_function.update_faculty_mapping);
router.delete("/faculty-mapping", mapping_function.delete_faculty_mapping);

module.exports = router;
