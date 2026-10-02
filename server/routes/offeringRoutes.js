const express = require('express');
const router = express.Router();
const {
    getAllOfferings,
    getOfferingById,
    createOffering,
    updateOfferings,
    deleteOffering,
} = require('../controllers/offeringController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, getAllOfferings);
router.post('/', authMiddleware, roleMiddleware('advisor'), createOffering);
router.patch('/:id', authMiddleware, roleMiddleware('advisor'), updateOfferings);
router.delete('/:id', authMiddleware, roleMiddleware('advisor'), deleteOffering);
router.get('/:id', authMiddleware, getOfferingById);


module.exports = router;