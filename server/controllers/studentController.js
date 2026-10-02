const Users = require('../models/Users');
const { getEligibleCourses } = require('../utils/eligibilityRules');

//GET /api/students/:id/eligible?term=2026-1
const getEligible = async (req, res) => {
    try {
        const {
            term
        } = req.query;
        if (!term) {
            return res.status(400).json({
                message: "term query parameter is required"
            });
        }

        const student = await Users.findById(req.params.id);
        if (!student || student.role !== 'student') {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const result = await getEligibleCourses(req.params.id, term);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error getting eligible courses:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getEligible };