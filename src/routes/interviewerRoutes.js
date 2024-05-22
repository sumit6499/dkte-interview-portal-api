import express from "express";
import auth from "../middleware/auth.js";
import {
  getInterviewers,
  updateInterviewerInfo,
  uploadIDcard,
} from "../controllers/interviewer.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();


router.get("/:day/all", auth, getInterviewers);
router.put("/:id", auth, updateInterviewerInfo);
router.patch("/:id/upload", upload.single("resume"), auth, uploadIDcard);
export default router;
