import express from "express";
import { createreview, getreview, deletereview } from "../controllers/reviewController.js";
import { verifyUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyUser, createreview);
router.get("/allReviews", getreview);  
router.delete("/:id", verifyUser, deletereview);  

export default router;
