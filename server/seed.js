const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Users = require("./models/Users")
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await Users.findOne(
            {
                role: 'admin'
            }
        );

        if(existingAdmin) {
            console.log('Admin already exists, skipping seed.');
            return;
        }

        const passwordHash = await bcrypt.hash('admin123', 10);

        await Users.create({ 
            name: 'System Admin',
            email: 'admin@csc220.edu',
            passwordHash,
            role: 'admin',
            active: true
        })

        console.log('admin account created.');
    } catch (error) {
        console.error('Seed error', error);
    } finally {
        mongoose.connection.close();
    }
};

seedAdmin();