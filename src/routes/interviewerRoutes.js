import express from "express";
import auth from "../middleware/auth.js";
import {
  getInterviewers,
  updateInterviewerInfo,
  uploadIDcard,
} from "../controllers/interviewer.js";

const router = express.Router();


router.get("/:day/all", auth, getInterviewers);
router.put("/:id", auth, updateInterviewerInfo);
// router.patch("/:id/upload", upload.single("resume"), auth, uploadIDcard);
export default router;
