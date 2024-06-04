const express = require('express');
const facutlyController =  require('../controllers/faculty')
const router = express.Router();

router.get('/faculty',facutlyController.getFaculty);

module.exports = router;