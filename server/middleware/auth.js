const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.js');
const dotenv = require('dotenv');
dotenv.config();

const verifyUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Not Authenticated: No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await UserModel.findById(decoded.id).select("-password");
        if (!req.user) {
            return res.status(401).json({ message: "Not Authenticated: Invalid User" });
        }
        next();
    } catch (error) {
        res.status(401).json({ message: "Not Authenticated: Invalid Token" });
    }
};

const verifyAdmin = async (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access Denied: Admin Only" });
    }
    next();
};

module.exports = { verifyUser, verifyAdmin };
