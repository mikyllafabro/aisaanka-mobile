const reviewModel = require("../models/Review.js");

// Create Review (Authenticated User)
const createreview = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: Please log in" });
        }

        const { issue, suggestion, rating } = req.body;

        // Validate input
        if (!issue || !suggestion || !rating) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newReview = new reviewModel({
            user: req.user._id, // Associate review with logged-in user
            issue,
            suggestion,
            rating,
        });

        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Reviews (Populate User Info)
const getreview = async (req, res) => {
    try {
        const reviews = await reviewModel.find().populate("user", "name username"); // Show username & email
        res.status(200).json(reviews);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Delete Review (Only Owner Can Delete)
const deletereview = async (req, res) => {
    const { id } = req.params;

    try {
        const review = await reviewModel.findById(id);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (req.user._id.toString() !== review.user.toString()) {
            return res.status(403).json({ message: "Unauthorized: You can only delete your own review" });
        }

        await reviewModel.findByIdAndRemove(id);
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createreview, getreview, deletereview };