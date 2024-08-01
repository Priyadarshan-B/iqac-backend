const express = require('express');
const courseController = require('../controllers/course')

const router = express.Router();

router.get('/course', courseController.getCourse);
router.get('/courseId', courseController.getCourse);

module.exports = router;
