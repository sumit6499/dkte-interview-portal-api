import express from "express";
import auth from "../middleware/auth.js";
import { getInterviewers } from "../controllers/interviewer.js";

const router = express.Router();


router.get("/:day/all", auth, getInterviewers);
router.put("/:id",auth)

export default router;
