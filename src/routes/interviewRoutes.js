import express from "express";
import auth from "../middleware/auth.js";
import {
  scheduleInterview,
  getFeedback,
  getAllInterviews,
  createFeedback,
} from "../controllers/interview.js";

const router = express.Router();

router.post("/:id/schedule", auth, scheduleInterview);
router.get("/:id/all", auth, getAllInterviews);
router.get("/:id/feedback", auth, getFeedback);
router.post("/:id/feedback", auth, createFeedback);

export default router;
