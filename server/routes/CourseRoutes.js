// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const {getAllCourses,updateCourse, createCourse, getCourseById, deleteCourse } = require('../controllers/courseController');

router.get('/', getAllCourses);
router.post('/', authMiddleware, roleMiddleware('advisor'), createCourse);
router.patch('/:id', authMiddleware, roleMiddleware('advisor'), updateCourse);
router.delete('/:id', authMiddleware, roleMiddleware('advisor'), deleteCourse);
router.get('/:id', getCourseById);

module.exports = router;