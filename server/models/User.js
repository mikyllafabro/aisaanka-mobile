import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    username: {
        type: String,
        required: true,
        max: 10
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    age: {
        type: Number,
        required: true,
        min: 1,
        max: 120
    },
    category: {
        type: String,
        required: true,
        enum: ["Daily Commuter", "Student", "Tourist"]
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    role: {
        type: String,
        enum: ["user", "admin"], // Restricts role values
        default: "user" // Sets default role
    },
    status: {
        type: String,
        enum: ["active", "inactive", "banned"],
        default: "active"
    },
    otp: {
        type: String,
        required: false
    },
    otpExpires: {
        type: Date,
        required: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    travelHistory: {
        type: Array,
        default: []
    },
});

const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
