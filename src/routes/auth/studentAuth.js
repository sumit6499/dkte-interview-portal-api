import express from "express";
import {
  login,
  signUp,
} from "../../controllers/students.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/login", login);
router.post(
  "/signup",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "idCard", maxCount: 1 },
    { name: "paymentImage", maxCount: 1 },
  ]),
  signUp
);


export default router;
