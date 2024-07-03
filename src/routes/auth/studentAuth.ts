import express from "express";
import {
  getOtpEmail,
  login,
  signUp,
} from "../../controllers/students";
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

router.post("/otp",getOtpEmail)
// router.post('/validate-otp')


export default router;
