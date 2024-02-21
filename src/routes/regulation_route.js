const express = require('express');
const regulationController = require('../controllers/regulation');

const router = express.Router();
router.get('/regulation', regulationController.getRegulation);
module.exports = router;