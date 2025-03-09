const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
const reviewModel = mongoose.model('Review', reviewSchema);

module.exports = reviewModel;