const express = require('express');
const router = express.Router();

const { login, changePassword } = require('../controllers/authcontroller');
const authMiddleware = require("../middleware/authMiddleware");
// POST login
router.post('/login', login);
router.patch('/change-password', authMiddleware, changePassword);

module.exports = router;