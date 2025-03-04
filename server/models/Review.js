const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    issue: {
        type: String,
        required: true,
        max: 10
    },
    suggestion: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
});

const ReviewModel = mongoose.model("review", reviewSchema);

module.exports = mongoose.model("Review", reviewSchema);