const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    claimMessage: {
        type: String,
        required: [true, 'Claim message is required'],
        trim: true
    },
    contactPhone: {
        type: String,
        required: [true, 'Contact phone is required']
    },
    proofDetails: {
        type: String,
        required: [true, 'Detailed proof is required']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    // Mock user identification until real auth is set up
    userEmail: {
        type: String,
        default: 'guest@local.app'
    },
    userName: {
        type: String,
        default: 'Guest User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Claim', claimSchema);
