const express = require('express');
const router = express.Router();
const {
    createRecord,
    updateRecord,
    deleteRecord,
} = require('../controllers/recordController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware('advisor'), createRecord);
router.patch('/:id', authMiddleware, roleMiddleware('advisor'), updateRecord);
router.delete('/:id', authMiddleware, roleMiddleware('advisor'), deleteRecord);

module.exports = router;