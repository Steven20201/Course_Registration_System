const Record = require('../models/Record');
const Users = require('../models/Users');
const Course = require('../models/Courses');

// POST /api/records
const createRecord = async (req, res) => {
    try {
        const {
            studentId,
            courseId,
            term,
            grade
        } = req.body;

        if (!studentId || !courseId || !term || !grade) {
            return res.status(400).json({
                message: "studentId, courseId, term, and grade are required"
            });
        }

        const student = await Users.findById(studentId);
        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: "Student not found" });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Duplicate check 
        const existing = await Record.findOne({
            studentId, courseId, tern
        });

        if (existing) {
            return res.status(400).json({ message: "A record for this student, course, and term already exists" });
        }

        const record = await Record.create({
            studentId, courseId, term, grade
        });

        const populatedRecord = await record.populate('courseId');

        res.status(201).json(populatedRecord);
    } catch (error) {
        console.error("Error creating record:", error);
        res.status(400).json({ message: error.message });
    }
};

// GET /api/students/:id/record  (Advisor views a student's full academic record)
const getStudentRecord = async (req, res ) => {
    try {
        const student = await Users.findById(req.params.id).select('-passwordHash');
        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: "Student not found" });
        }

        const records = await Record.find({
            studentId: req.params.id
        })
        .populate('courseId')
        .sort({ term: 1 });

        res.status(200).json({ student, records });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET /api/me/record  (Student views own record)
const getMyRecord = async (req, res) => {
    try {
        const records = await Record.find({
            studentId: req.user.id
        })
        .populate('courseId')
        .sort({
            term: 1
        });
        
        res.status(500).json(records);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

//PATCH /api/records/:id (Advisor edits a grade — correction)
const updateRecord = async (req, res) => {
    try {
        const { grade } = req.body;

        const record = await Record.findById(req.params.id);
        if (!record) {
            return res.status(404).json ({ message: "Record not found"});
        }

        if (grade !== underfind) record.grade = grade;
        await record.save();

        res.status(200).json(record);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

//DELECT /api/records/:id
const deleteRecord = async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        } 
        await Record.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Record deleted successfully" });
    } catch (error) {
        res.status(400).json ({
            message: error.message
        });
    }
};

module.exports = {
    createRecord,
    getStudentRecord,
    getMyRecord,
    updateRecord,
    deleteRecord,
};

