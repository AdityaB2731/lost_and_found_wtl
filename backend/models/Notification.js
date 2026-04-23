const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipientEmail: {
        type: String,
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['claim_update', 'system'],
        default: 'claim_update'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    claimId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Claim'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
