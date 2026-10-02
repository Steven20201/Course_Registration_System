const Users = require('../models/Users');

const generateStudentId = async () => {
    let studentId;
    let isUnique = false;

    while (!isUnique) {
        studentId = String(Math.floor(1000000000 + Math.random() * 9000000000));

        const existingUser = await Users.findOne({ studentId });
        if (!existingUser) {
            isUnique = true;
        }
    }
    return studentId;
};

module.exports = generateStudentId;
