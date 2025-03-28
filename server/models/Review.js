import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    issue: {
        type: String,
        required: true,
        max: ""
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
    time: {
        type: Date,
        required: true,
        default: Date.now,
      },
    deleted: {
        type: Boolean,
        default: false
    },
    journey: {
        from: String,
        to: String,
        fare: String,
        duration: String
    },
});

const ReviewModel = mongoose.model("review", reviewSchema);
export default ReviewModel;
