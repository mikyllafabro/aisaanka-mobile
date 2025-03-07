const bcrypt = require('bcrypt');
const UserModel = require('../models/User.js');
const { generateOtp } = require('../utils/otp.js');
const { sendOtpEmail } = require('../utils/mailer.js');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp();
        const otpExpires = Date.now() + 3600000; // 1 hour validity

        sendOtpEmail(email, otp);

        const newUser = new UserModel({ username, name, email, password: hashedPassword, otp, otpExpires, role: "user" });
        await newUser.save();

        res.status(201).json({ message: "User created. Please check your email for the OTP." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        if (user.role === "user" && !user.isVerified) {
            return res.status(401).json({ message: "Verify your email with the OTP.", redirect: "/verify-otp" });
        }

        if (user.status === "banned") {
            return res.status(403).json({ message: "You have been banned by the admin. Please contact support." });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Success",
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const logout = (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            res.status(err ? 500 : 200).json(err ? "Failed to logout" : "Logged out successfully");
        });
    } else {
        res.status(400).json({ error: "No session found" });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;

        await user.save();

        res.status(200).json({
            message: "OTP verified successfully",
            redirect: "/home"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newOtp = generateOtp();
        user.otp = newOtp;
        user.otpExpires = Date.now() + 3600000;

        await user.save();
        await sendOtpEmail(email, newOtp);

        res.status(200).json({ message: "A new OTP has been sent to your email." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
};

const getProfile = async (req, res) => {
    try {
        // ✅ Get token from request headers
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // ✅ Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // ✅ Find user in the database (excluding password)
        const user = await UserModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { username, name, email, currentPassword, newPassword } = req.body;
        const user = await UserModel.findById(req.user.id);

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // If updating password, verify current password
        if (newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Incorrect current password" });
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }

        // Update user fields
        user.username = username || user.username;
        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();

        res.status(200).json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating profile" });
    }
};

module.exports = {
    signup,
    loginUser,
    logout,
    verifyOtp,
    resendOtp,
    getProfile,
    updateProfile,
};
