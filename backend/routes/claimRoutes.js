const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Item = require('../models/Item');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// @route   POST /api/claims
// @desc    Submit a new claim
router.post('/', auth, async (req, res) => {
    try {
        const { itemId, claimMessage, contactPhone, proofDetails } = req.body;

        // Check if item exists
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }

        const newClaim = new Claim({
            itemId,
            claimMessage,
            contactPhone,
            proofDetails,
            userEmail: req.user.email,
            userName: req.user.fullName
        });

        const claim = await newClaim.save();
        
        // Mark item as pending so it's hidden from browse
        await Item.findByIdAndUpdate(itemId, { status: 'pending' });
        
        res.status(201).json(claim);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/claims/my
// @desc    Get claims made by the current user
router.get('/my', auth, async (req, res) => {
    try {
        const claims = await Claim.find({ userEmail: req.user.email })
            .populate('itemId', ['itemName', 'imageUrl'])
            .sort({ createdAt: -1 });
        
        // Format for frontend
        const formattedClaims = claims.map(c => ({
            id: c._id,
            item_name: c.itemId?.itemName || 'Unknown Item',
            image_url: c.itemId?.imageUrl 
                ? (c.itemId.imageUrl.startsWith('http') ? c.itemId.imageUrl : `http://localhost:5000${c.itemId.imageUrl}`)
                : '',
            claim_message: c.claimMessage,
            status: c.status,
            created_at: c.createdAt
        }));

        res.json(formattedClaims);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/claims/all
// @desc    Get all claims (Admin only)
router.get('/all', async (req, res) => {
    try {
        const claims = await Claim.find()
            .populate('itemId', ['itemName', 'imageUrl'])
            .sort({ createdAt: -1 });
        
        const formattedClaims = claims.map(c => ({
            id: c._id,
            item_name: c.itemId?.itemName || 'Unknown Item',
            image_url: c.itemId?.imageUrl 
                ? (c.itemId.imageUrl.startsWith('http') ? c.itemId.imageUrl : `http://localhost:5000${c.itemId.imageUrl}`)
                : '',
            claim_message: c.claimMessage,
            status: c.status,
            userEmail: c.userEmail,
            userName: c.userName,
            created_at: c.createdAt
        }));

        res.json(formattedClaims);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/claims/item/:itemId
// @desc    Get all claims for a specific item (for owner review)
router.get('/item/:itemId', async (req, res) => {
    try {
        const claims = await Claim.find({ itemId: req.params.itemId }).sort({ createdAt: -1 });
        res.json(claims);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH /api/claims/:id/status
// @desc    Update claim status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const claim = await Claim.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({ msg: 'Claim not found' });
        }

        claim.status = status;
        await claim.save();

        // If approved, mark the item as claimed
        if (status === 'approved') {
            await Item.findByIdAndUpdate(claim.itemId, { status: 'claimed' });
            // Reject other pending claims for this item
            const otherClaims = await Claim.find({ itemId: claim.itemId, _id: { $ne: claim._id }, status: 'pending' });
            
            for (const other of otherClaims) {
                other.status = 'rejected';
                await other.save();
                // Notify rejected users
                await Notification.create({
                    recipientEmail: other.userEmail,
                    message: `Your claim for the item has been rejected.`,
                    claimId: other._id
                });
            }
        } else if (status === 'rejected') {
            // Ensure the item is set back to available
            await Item.findByIdAndUpdate(claim.itemId, { status: 'available' });
        }

        // Notify the user about their claim status update
        await Notification.create({
            recipientEmail: claim.userEmail,
            message: `Your claim status has been updated to: ${status}.`,
            claimId: claim._id
        });

        res.json(claim);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
