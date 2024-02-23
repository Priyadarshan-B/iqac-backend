const express =  require('express')

const faculty_dropdown = require('../../controllers/course_faculty_mapping/dropdown/faculty')

const router = express.Router();

router.get('/dropdown/faculty', faculty_dropdown.get_faculty)

module.exports = router;
