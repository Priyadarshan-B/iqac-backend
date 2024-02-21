// src/routes/academicYearRoutes.js
const express = require('express');
const academicYearController = require('../controllers/academicyear');

const router = express.Router();

// Define route for fetching academic years
router.get('/academic_years', academicYearController.getAcademicYears);

module.exports = router;
