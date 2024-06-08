const express = require('express');
const departmentController = require('../controllers/department');

const router = express.Router();
router.get('/department', departmentController.getDepartment);
module.exports = router;