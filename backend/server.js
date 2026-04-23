require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    family: 4, // Force IPv4
    serverSelectionTimeoutMS: 5000
})
    .then(() => console.log('Connected to MongoDB Successfully!'))
    .catch(err => {
        console.error('MongoDB connection error details:');
        console.error('Message:', err.message);
        console.error('Code:', err.code);
        if (err.message.includes('ECONNREFUSED')) {
            console.error('TIP: This often means your IP is not whitelisted in MongoDB Atlas or there is a DNS issue.');
        }
        process.exit(1);
    });

// Routes
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/claims', require('./routes/claimRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
