const express = require('express');
const router = express.Router();

const {
    createRegistration,
    getAllRegistraions,
    deleteRegistration
} = require('../controllers/registrationController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware('advisor', createRegistration));
router.get('/', authMiddleware, roleMiddleware('advisor', getAllRegistraions));
router.delete('/', authMiddleware, roleMiddleware('advisor', deleteRegistration));

module.exports = router;