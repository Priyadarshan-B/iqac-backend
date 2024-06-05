const express = require('express');
const markentryController = require('../controllers/markentry')
const router  = express.Router();

router.post('/updateMarks',markentryController.updateMarks)
router.get('/marks',markentryController.getMarks)
module.exports = router