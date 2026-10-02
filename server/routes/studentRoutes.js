// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const { getStudentRecord } = require('../controllers/recordController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getEligible } = require('../controllers/studentController');

router.get('/:id/record', authMiddleware, roleMiddleware('advisor'), getStudentRecord);
router.get('/:id/eligible', authMiddleware, roleMiddleware('advisor'), getEligible);

module.exports = router;