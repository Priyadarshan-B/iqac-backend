const express =  require('express');
const testTypeController =  require('../controllers/testtype')

const router = express.Router();

router.get('/testType',testTypeController.getTestType);

module.exports = router;