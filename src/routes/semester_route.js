const express = require('express');
const semesterController = require('../controllers/semester');
const semesterEvaluationController = require('../controllers/semesterEvaluation.js');

const router = express.Router();
router.get('/semester', semesterController.getSemester);
router.post('/createSemesterEvaluation', semesterEvaluationController.createEvaluationMapping);
router.get('/getSemesterEvaluation', semesterEvaluationController.getEvaluationMapping);
router.get('/semesterFacultyAllocation', semesterEvaluationController.getSemesterFacultyAllocation);
router.get('/facultySuggestionCourseDetails', semesterEvaluationController.getFacultyCourseDetails); // Added new route
router.post('/replaceFaculty',semesterEvaluationController.replaceFaculty)
module.exports = router;
