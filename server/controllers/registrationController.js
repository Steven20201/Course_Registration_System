const Registration = require('../models/Registration');
const Offering = require('../models/Offering');
const Users = require('../models/Users');

//POST /api/registrations (Advisor registers a student)
const createRegistration = async (req, res) => {
    try {
        const {
            studentId,
            offeringId
        } = req.body;

        //check whether the StudentID and offeringID is filled
        if (!studentId || !offeringId) {
            return res.status(400).json({
                message: "studentId and offeringId are required"
            });
        }
        // If there is any student
        const student = await Users.findById(studentId);
        if (!student || student.role !== 'student') {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        //There is any offering
        const offering = await Offering.findById(offeringId);
        if (!offering) {
            return res.status(404).json({
                message: "Offering not found"
            });
        }

        //There is any available seats or not
        if (offering.seatsTaken >= offering.seats) {
            return res.status(400).json({
                message: "This section is full"
            });
        }

        //Duplicate registration check
        const existingRegistration = await Registration.findOne({
            studentId,
            offeringId,
            status: 'registered',
        });
        if (existingRegistration) {
            return res.status(400).json({
                message: "Student is already registered"
            });
        }

        //Time clash check
        const studentRegistrations = await Registration.find({
            studentId,
            term: offering.term,
            status: 'registered'
        }).populate('offeringId');

        const hasClash = studentRegistrations.some((reg) => {
            const existing = reg.offeringId;
            return (
                existing.day === offering.day &&
                existing.startTime < offering.endTime &&
                existing.endTime > offering.startTime
            );
        });
        if (hasClash) {
            return res.status(400).json({
                message: "This offering clashes with an registrated course"
            })
        }

        //registration create
        const registration = await Registration.create({
            studentId,
            offeringId,
            term: offering.term,
            status: 'registered',
        });

        //The seattaken for offering 
        offering.seatsTaken += 1;
        await offering.save();

        const populatedRegistration = await registration.populate('offeringId');
        res.status(201).json(populatedRegistration);
    } catch (error) {
        console.error("Error creating registration:", error);
        res.status(400).json({ message: error.message });
    }
};

//GET /api/registrations?studentId = ...term=... (Advisor role)
const getAllRegistrations = async (req, res) => {
    try {
        const filter = {};
        if (req.query.studentId) filter.studentId = req.query.studentId;
        if (req.query.term) filter.term = req.query.term;
        if (req.query.status) filter.status = req.query.status;

        const registrations = await Registration.find(filter)
            .populate('studentId', '-passwordHash')
            .populate({
                path: 'offeringId',
                populate: {
                    path: 'courseId'
                }
            });
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//GET /api/me/registrations (Student views own)
const getMyRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({
            studentId: req.user.id,
            status: 'registered',
        }).populate({
            path: 'offeringId',
            populate: {
                path: 'courseId'
            }
        });

        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//DELETE /api/registrations/:id (Advisor removes a registration)
const deleteRegistration = async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id);
        if (!registration) {
            return res.status(404).json({
                message: "Registration not found"
            });
        }

        //SeatsTaken for Offering 
        const offering = await Offering.findById(registration.offeringId);
        if (offering && offering.seatsTaken > 0) {
            offering.seatsTaken -= 1;
            await offering.save();
        }

        //status dropped
        registration.status = 'dropped';
        await registration.save();

        res.status(200).json({
            message: "Registraion dropped successfully", registration
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
};

module.exports = {
    createRegistration,
    getAllRegistrations,
    getMyRegistrations,
    deleteRegistration
}