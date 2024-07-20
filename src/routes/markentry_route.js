const express = require('express');
const markentryController = require('../controllers/markentry')
const router = express.Router();

router.post('/updateMarks', markentryController.updateMarks)
router.get('/marks', markentryController.getMarks)
router.post('/updateAttendance', markentryController.updateAttendance)
router.get('/markReport', markentryController.markReport)
router.get('/getAbsentees', markentryController.getAbsentees)
router.get('/getFailures', markentryController.getFailures)
router.get('/getMarkList', markentryController.getMarkList)
module.exports = router
