const express = require('express');
const courseOutcomeController = require('../controllers/courseoutcome')

const router = express.Router();

router.get('/co',courseOutcomeController.getCourseOutcome);

module.exports = router;