const express = require('express');
const degreeController = require('../controllers/degree');

const router = express.Router();
router.get('/degree', degreeController.getDegree);
module.exports = router;