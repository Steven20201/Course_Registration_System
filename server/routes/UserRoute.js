const express = require('express');
const router = express.Router();

const { getAllUsers, createUser, createAdvisor, updateUser, getUserById, deleteUser } = require('../controllers/userscontrollers');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');  
//POST create a new advisor
router.post('/advisor', authMiddleware, roleMiddleware('admin'), createAdvisor);

// GET all users
router.get('/', authMiddleware, roleMiddleware('admin', 'advisor'), getAllUsers);

// POST create a new user
router.post('/', authMiddleware, roleMiddleware('admin'), createUser);

//update user by id
router.patch('/:id', authMiddleware, roleMiddleware('admin'), updateUser);


router.get('/:id', authMiddleware, roleMiddleware('admin'), getUserById);

//DELETE user by id
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteUser);

module.exports = router;