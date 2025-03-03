import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Replace this with your actual secret key from environment variables
const SECRET_KEY = "c6aff10d41e85406271676c8af667b1dadd162f9b1b3a935e9f32aab1892e72e";  // ✅ Temporary hardcoded key


// User Registration
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate role
        if (!role || (role !== 'student' && role !== 'teacher')) {
            return res.status(400).json({ message: "Invalid role. Must be 'student' or 'teacher'." });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        console.log("✅ User Registered:", email, "Role:", role);  // ✅ Debugging line

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// User Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log("🟡 Login Attempt:", email);  // ✅ Debug log

        // Find user (Make sure it's not filtering only students)
        const user = await User.findOne({ email });

        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(400).json({ message: 'User not found' });
        }

        console.log("✅ User Found:", user.email, "Role:", user.role);  // ✅ Debug log
        
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Invalid password for:", email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log("✅ Password Matched for:", email, "Logging in...");  // ✅ Debug log
        
        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user });
    } catch (error) {
        console.log("❌ Login Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Verify Token (For Frontend)
export const verifyToken = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) return res.status(401).json({ message: 'Invalid token' });

        res.json({ user });
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token', error: error.message });
    }
};
