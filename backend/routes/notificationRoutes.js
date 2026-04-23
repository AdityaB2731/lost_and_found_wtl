const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

const auth = require('../middleware/auth');

// @route   GET /api/notifications/my
// @desc    Get notifications for the current user
router.get('/my', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipientEmail: req.user.email })
            .sort({ createdAt: -1 })
            .limit(20);
        
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH /api/notifications/:id/read
// @desc    Mark notification as read
router.patch('/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        res.json(notification);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
