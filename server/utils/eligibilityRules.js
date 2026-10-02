const Course = require('../models/Courses');
const Offering = require('../models/Offering');
const Record = require('../models/Record');
const Registration = require('../models/Registration');

const PASSING_GRADES = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D'];

const getEligibileCourses = async (generateStudentId, term) => {
    //Rule: Offered this term
    const currentOfferings = await Offering.find({
        term
    }).populate('courseId');

    //Student's academic record
    const studentRecords = await Record.find({ 
        studentId
    }).populate('courseId');

    //student's term registration
    const studentRegistrations = await Registration.find({
        studentId,
        term,
        status: 'registered',
    }).populate('offeringId');

    const registeredOfferings = studentRegistrations.map((r) => r.offeringId);

    const recordMap = {};
    studentRecords.forEach((rec) => {
        const courseIdStr = rec.courseId._id.toString();
        if(!recordMap[courseIdStr]) {
            recordMap[courseIdStr] = [];
        }
        recordMap[courseIdStr].push(rec.grade);
    });

    const eligibleList = [];
    const excludedList = [];

    //Rules for Offering
    for (const offering of currentOfferings) {
        const course = offering.courseId;
        const courseIdStr = course._id.toString();
        const grades = recordMap[courseIdStr] || [];
        
        //Rule : F
        const hasF = grades.includes('F');
        //Rule: Already passed (D or better)
        const hasPassed = grades.some((g)=> PASSING_GRADES.includes(g));

        //Rule: Already passed
        if (hasPassed && !hasF) {
            excludedList.push({
                course,
                offering,
                reason: `Already passed — grade ${grades.find((g) => PASSING_GRADES.includes(g))}`,
            });
            continue;
        }

        //Rule: Seats available
        const seatsRemaining = offering.seats - offering.seatsTaken;
        if (seatsRemaining <= 0) {
            excludedList.push({
                course,
                offering,
                reason:  'Full — 0 seats remaining',
            });
            continue;
        }

        //Rule: No time clash
        const clash = registeredOfferings.find((existing) => {
            return (
                existing.day === offering.day &&
                existing.startTime < offering.endTime &&
                existing.endTime > offering.startTime
            );
        });
        if (clash) {
            excludedList.push ({
                course,
                offering,
                reason: `Clashes with ${clash.day} ${clash.startTime}-${clash.endTime} (already registered)`,
            });
            continue;
        }

        eligibleList.push ({
            course, 
            offering, 
            retakeRequired: hasF,
            seatsRemaining
        });
    }

    //Rule: F
    eligibleList.sort((a, b) => (b.retakeRequired ? 1 : 0) - (a.retakeRequired ? 1 : 0));

    return { eligible: eligibleList, excluded: excludedList };
};

module.exports = {
    getEligibileCourses
};