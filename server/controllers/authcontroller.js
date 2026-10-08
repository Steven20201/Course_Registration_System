const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne(
            {
                email
            }
        );
        if (!user) {
            return res.status(401).json(
                {
                    message: "Invalid email or password"
                }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json(
                {
                    message: "Invalid email or password"
                }
            );
        }

        if (!user.active) {
            return res.status(403).json(
                {
                    message: "User account has been deactivated."
                }
            );
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        res.status(200).json(
            {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    mustChangePassword: user.mustChangePassword,
                }
            });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

};

const changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters" });
        }

        const user = await Users.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.passwordHash = await bcrypt.hash(newPassword, 10);
        user.mustChangePassword = false;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(400).json({ message: error.message });
    }
};


module.exports = {
    login,
    changePassword
};