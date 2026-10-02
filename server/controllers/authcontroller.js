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
                }
            });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

};

module.exports = {
    login
};