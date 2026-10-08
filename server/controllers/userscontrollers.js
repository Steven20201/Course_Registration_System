const Users = require("../models/Users")
const bcrypt = require('bcryptjs');
const generateStudentId = require('../utils/generateStudentId');
const generateAdvisorId = require('../utils/generateAdvisor');

// GET /api/users?role=student
const getAllUsers = async (req, res) => {
    try {
        const filter = {};
        if (req.query.role) {
            filter.role = req.query.role;
        }

         if (req.user.role === 'advisor' && filter.role !== 'student') {
            return res.status(403).json({ message: "Advisors can only view students" });
        }
        
        const users = await Users.find(filter)
            .select('-passwordHash');

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// get users by id
const getUserById = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// POST /api/users
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, advisorId } = req.body;

        const existingUser = await Users.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const userData = {
            name,
            email,
            passwordHash,
            role: "student",
            mustChangePassword: true,
            studentId: await generateStudentId()
        };



        if (advisorId) {
            userData.advisorId = advisorId;
        }


        const user = new Users(userData);

        await user.save();

        res.status(201).json(user);

    } catch (error) {
        console.error("Error creating user:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

//create a new user with role advisor
const createAdvisor = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await Users.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const userData = {
            name,
            email,
            passwordHash,
            role: "advisor",
            advisorId: await generateAdvisorId()
        };

        const user = new Users(userData);

        await user.save();

        res.status(201).json(
            {
                message: "Advisor created successfully",
                user
            }
        );

    } catch (error) {
        console.error("Error creating advisor:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

//Patch /api/users/:id

const updateUser = async (req, res) => {
    try {
        const { name, email, role, active } = req.body;

        const targetUser = await Users.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (email !== undefined && email !== targetUser.email) {
            const existingUser = await Users.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User with this email already exists" });
            }
        }

        if (targetUser.role === "admin" && role && role !== "admin") {
            const adminCount = await Users.countDocuments({ role: "admin" });
            if (adminCount <= 1) {
                return res.status(400).json({ message: "Cannot change role of the last admin" });
            }
        }

        if (targetUser.role === "admin" && active !== undefined) {
            return res.status(400).json({ message: "Admin accounts cannot be activated or deactivated" });
        }

        // Update fields if provided
        if (name !== undefined) targetUser.name = name;
        if (email !== undefined) targetUser.email = email;
        if (role !== undefined) targetUser.role = role;
        if (active !== undefined) targetUser.active = active;

        await targetUser.save();

        const userResponse = targetUser.toObject();
        delete userResponse.passwordHash;

        res.status(200).json(userResponse);
    } catch (error) {
        console.error("Error updating user: ", error);
        res.status(400).json({message: error.message});
    }
}

//DELETE /api/users/:id
const deleteUser = async (req, res) => {
    try {
        const targetUser = await Users.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }
        //Self-deleted
        if (targetUser._id.toString() === req.user.id) {
            return res.status(400).json({message: "You cannot delete your own account"});
        }

        //last admin guard
        if (targetUser.role === "admin") {
            const adminCount = await Users.countDocuments({ 
                role: "admin" 
            });
            if (adminCount <= 1) {
                return res.status(400).json({ 
                    message: "Cannot delete the last remaining admin" 
                });
            }
        }

        //After all the conditions are corrected
       if (!targetUser.active) {
        return res.status(400).json({
            message: "This user is already inactive"
        });
       }

       targetUser.active = false;
       await targetUser.save();
       
    } catch (error) {
        console.error("Error deleting user: ", error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getAllUsers, createUser, createAdvisor, getUserById, updateUser, deleteUser };
