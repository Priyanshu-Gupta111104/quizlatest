const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB Atlas
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if no server is found
            socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1); // Stop the server if the database connection fails
    }
};

module.exports = connectDB;
