const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    passwordHash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'advisor', 'admin'],
        required: true,
    },
    studentId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,

    },
    advisorId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
    },

    active: {
        type: Boolean,
        default: true,
    }
},
    {
        timestamps: true,
    }

);

module.exports = mongoose.model('User', userSchema);
