const express = require("express");
const { signup, loginUser, logout, verifyOtp, resendOtp, getProfile, updateProfile } = require("../controllers/authController.js");
const { verifyUser, verifyAdmin } = require("../middleware/auth.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", loginUser);
router.post("/logout", verifyUser, logout);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/profile", verifyUser, getProfile);
router.put("/profile", verifyUser, updateProfile);

router.get("/admin-dashboard", verifyUser, verifyAdmin, (req, res) => {
    res.json({ message: "Welcome, Admin!" });
});

module.exports = router;