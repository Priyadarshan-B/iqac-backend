const express = require('express');
const markentryController = require('../controllers/markentry')
const router = express.Router();

router.post('/updateMarks', markentryController.updateMarks)
router.get('/marks', markentryController.getMarks)
router.post('/updateAttendance', markentryController.updateAttendance)
router.get('/markReport', markentryController.markReport)
router.get('/getAbsentees', markentryController.getAbsentees)
router.get('/absenteesReport', markentryController.absenteesReport)
router.get('/failureReport', markentryController.failureReport)
router.get('/studentReport', markentryController.getStudentReport)
router.get('/absenteesAndFailureReport', markentryController.absenteesAndFailures)
router.get('/getFailures', markentryController.getFailures)
router.get('/getAbsenteesAndFailures', markentryController.getAbsenteesAndFailures)
router.get('/getMarkList', markentryController.getMarkList)
module.exports = router
