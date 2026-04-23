const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true
    },
    locationFound: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    foundDate: {
        type: Date,
        default: Date.now
    },
    imageUrl: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['available', 'pending', 'claimed'],
        default: 'available'
    },
    // For now, we'll store dummy user info until real auth is connected
    userId: {
        type: String,
        default: 'guest@local.app'
    },
    fullName: {
        type: String,
        default: 'Guest User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);
