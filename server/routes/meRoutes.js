const express = require('express');
const router = express.Router();
const { getMyRegistrations } = require('../controllers/registrationController');
const { getMyRecord } = require('../controllers/recordController'); 
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/registrations', authMiddleware, roleMiddleware('student'), getMyRegistrations);
router.get('/record', authMiddleware, roleMiddleware('student'), getMyRecord);

module.exports = router;