const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'lost-and-found-items',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// @route   POST /api/items
// @desc    Create a new item
router.post('/', [auth, upload.single('image')], async (req, res) => {
    try {
        const { itemName, description, category, locationFound, foundDate } = req.body;
        
        let imageUrl = '';
        if (req.file) {
            // Use the Cloudinary URL provided by the storage engine
            imageUrl = req.file.path;
        }

        const newItem = new Item({
            itemName,
            description,
            category,
            locationFound,
            foundDate,
            imageUrl,
            userId: req.user.id,
            fullName: req.user.fullName
        });

        const item = await newItem.save();
        res.status(201).json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/items/my
// @desc    Get user's items
router.get('/my', auth, async (req, res) => {
    try {
        const items = await Item.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/items
// @desc    Get all active and claimed items (hides pending)
router.get('/', async (req, res) => {
    try {
        const items = await Item.find({ status: { $ne: 'pending' } }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/items/:id
// @desc    Get item by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });
        res.json(item);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Item not found' });
        res.status(500).send('Server Error');
    }
});

module.exports = router;
