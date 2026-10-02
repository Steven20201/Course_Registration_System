const Offering = require('../models/Offering');
const Course = require('../models/Courses');
const Registration = require('../models/Registration');

//Get /api/offerings?term=
const getAllOfferings = async (req, res) => {
    try {
        const filter = {};
        if (req.query.term) {
            filter.term = req.query.term;
        }

        const offerings = await Offering.find(filter).populate('courseId');
        res.status(200).json(offerings);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//Get /api/offerings/:id
const getOfferingById = async (req, res) => {
    try {
        const offering = await Offering.findById(req.params.id).populate('courseId');
        if (!offering) {
            return res.status(404).json({
                message: "offering not found"
            });
        }
        res.status(200).json(offering);
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
};

//POST /api/offerings
const createOffering = async (req, res) => {
    try {
        const {
            courseId,
            term,
            section,
            day,
            startTime,
            endTime,
            room,
            instructor,
            seats
        } = req.body;

        if (!courseId || !term || !section || !day || !startTime || !endTime || !room || !instructor || !seats) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        //check the courseId 
        const courseExists = await Course.findById(courseId);
        if (!courseExists) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        //seats should be positive no
        if (seats <= 0) {
            return res.status(400).json({
                message: "Seats must be a positive number"
            });
        }

        //Time Clash check 
        const clashingOffering = await Offering.findOne({
            instructor,
            term,
            day,
            $or: [
                {
                    startTime: {
                        $lt: endTime
                    },
                    endTime: {
                        $gt: startTime
                    }
                },
            ],
        });
        if (clashingOffering) {
            return res.status(400).json({
                message: "This instructor has already a class at this day/time"
            })
        }

        const existingOffering = await Offering.findOne({
            courseId, term, section
        });
        if (existingOffering) {
            return res.status(400).json({
                message: "This section already exists."
            })
        }

        const offering = await Offering.create({
            courseId,
            term,
            section,
            day,
            startTime,
            endTime,
            room,
            instructor,
            seats,
            seatsTaken: 0,
            addDropOpen: false,
        });

        const populatedOffering = await offering.populate('courseId');
        res.status(201).json(populatedOffering);
    }
    catch (error) {
        console.error("Error catching offering:", error);
        res.status(400).json({
            message: error.message
        });
    }
};

//PATCH /api/offerings/:id
const updateOfferings = async (req, res) => {
    try {
        const {
            term,
            section,
            day,
            startTime,
            endTime,
            room,
            instructor,
            seats,
            seatsTaken,
            addDropOpen
        } = req.body;

        const targetOffering = await Offering.findById(req.params.id);
        if (!targetOffering) {
            return res.status(404).json({
                message: "Offering not found"
            });
        }

        //Seats should be less than the seatsTaken
        if (seats != undefined && seats < targetOffering.seatsTaken) {
            return res.status(400).json({
                message: "Seats cannot be less than seats already taken"
            })
        }

        if (term !== undefined) targetOffering.term = term;
        if (section !== undefined) targetOffering.section = section;
        if (day !== undefined) targetOffering.day = day;
        if (startTime !== undefined) targetOffering.startTime = startTime;
        if (endTime !== undefined) targetOffering.endTime = endTime;
        if (room !== undefined) targetOffering.room = room;
        if (instructor !== undefined) targetOffering.instructor = instructor;
        if (seats !== undefined) targetOffering.seats = seats;
        if (seatsTaken !== undefined) targetOffering.seatsTaken = seatsTaken;
        if (addDropOpen !== undefined) targetOffering.addDropOpen = addDropOpen;

        await targetOffering.save();

        const populatedOffering = await targetOffering.populate('courseId');
        res.status(200).json(populatedOffering);
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
};

//Delete /api/offerings/:id
const deleteOffering = async (req, res) => {

    try {
        const targetOffering = await Offering.findById(req.params.id);
        if (!targetOffering) {
            return res.status(404).json({
                message: "Offering not found"
            })
        }

        const hasRegistrations = await Registration.exists({ offeringId: targetOffering._id });
        if (hasRegistrations) {
            return res.status(400).json({ message: "Cannot delete offering with existing registrations" });
        }

        await Offering.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Offering deleted successfully"
        })
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

};

module.exports = { getAllOfferings, getOfferingById, createOffering, updateOfferings, deleteOffering };