import express from "express";
import { login, signUp } from "../../controllers/interviewer.ts";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/login", login);
router.post("/signup",upload.single("idCard"), signUp);

export default router;
