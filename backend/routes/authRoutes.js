const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (user) => {
    return jwt.sign(
        {
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                fullName: user.fullName,
            },
        },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
    );
};

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            fullName,
            email,
            password,
            role: email.toLowerCase() === 'admin@lostfound.com' ? 'admin' : 'user'
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            },
            token: createToken(user)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token (simple version)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            },
            token: createToken(user)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
