const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const verifyUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not Authenticated: No Token Provided" });
        }

        const token = authHeader.split(" ")[1];
        console.log("Token received on backend:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token Payload:", decoded);

        // Fix: Use email instead of id
        req.user = await User.findOne({ email: decoded.email }).select("-password");
        if (!req.user) {
            return res.status(401).json({ message: "Not Authenticated: User not found" });
        }

        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        res.status(401).json({ message: "Not Authenticated: Invalid Token" });
    }
};


// Admin-only route check (optional, as needed)
const verifyAdmin = async (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access Denied: Admin Only" });
    }
    next();
};

module.exports = { verifyUser, verifyAdmin };
