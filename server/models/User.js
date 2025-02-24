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
});

// Middleware to hash password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash password if it's modified
    this.password = await bcrypt.hash(this.password, 10); // Hash password with salt rounds
    next();
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
