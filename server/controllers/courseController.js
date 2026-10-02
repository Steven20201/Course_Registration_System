//controllers/courseController.js
const Course = require('../models/Courses');
const Offering = require('../models/Offering');

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//Post /api/courses
const createCourse = async (req, res) => {
    try {
        const {
            code,
            title,
            credits,
            department
        } = req.body;

        // Required field validation
        if (!code || !title || !credits) {
            return res.status(400).json({ message: "Code, title, and credits are required" });
        }

        // Credits ကို positive number ဖြစ်အောင် စစ်
        if (credits <= 0) {
            return res.status(400).json({ message: "Credits must be a positive number" });
        }

        const existing = await Course.findOne({
            code
        });

        if (existing) {
            return res.status(400).json({
                message: "Course with this code already exists."
            });
        }

        // Course code format 
        const codePattern = /^[A-Z]{3}\d{3}$/;
        if (!codePattern.test(code)) {
            return res.status(400).json({ message: "Course code must follow format like CSC220" });
        }

        const course = await Course.create(
            {
                code,
                title,
                credits,
                department
            }
        );

        res.status(201).json(course);
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(400).json({ message: error.message });
    }
};


//Get /api/courses/:id
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//PATCH //api/courses/:id
const updateCourse = async (req, res) => {
    try {
        const { code, title, credits, department } = req.body;

        const targetCourse = await Course.findById(req.params.id);
        if (!targetCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (code !== undefined && code !== targetCourse.code) {
            const existing = await Course.findOne({ code });
            if (existing) {
                return res.status(400).json({ message: "Course with this code already exists" });
            }
        }
        if (code !== undefined) targetCourse.code = code;
        if (title !== undefined) targetCourse.title = title;
        if (credits !== undefined) targetCourse.credits = credits;
        if (department !== undefined) targetCourse.department = department;

        await targetCourse.save();
        res.status(200).json(targetCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
    try {
        const targetCourse = await Course.findById(req.params.id);
        if (!targetCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        const hasOfferings = await Offering.exists({ courseId: targetCourse._id });
        if (hasOfferings) {
            return res.status(400).json({ message: "Cannot delete course with existing offerings" });
        }

        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getAllCourses, createCourse, updateCourse, getCourseById, deleteCourse };