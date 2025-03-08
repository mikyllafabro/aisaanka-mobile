const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        maxLength: [30, 'Your name cannot exceed 30 characters'],
        default: 'DefaultUsername'
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
    },
    password: {
        type: String,
        minlength: [6, 'Your password must be longer than 6 characters'],
    },
    role: {
        type: Number,
        default: 1, // 0 - Admin, 1 - User
    },
    otp: String,
    otpExpires: Date,
});

module.exports = mongoose.model('User', userSchema);
