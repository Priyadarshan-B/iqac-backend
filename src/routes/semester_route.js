const express = require('express');
const semesterController = require('../controllers/semester');

const router = express.Router();
router.get('/semester', semesterController.getSemester);
module.exports = router;
