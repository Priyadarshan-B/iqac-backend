const express = require('express');
const yearController = require('../controllers/year')
const router = express.Router()

router.get('/year',yearController.getYear);

module.exports = router;