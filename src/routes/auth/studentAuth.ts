import express from "express";
import {
  getOtpEmail,
  getSignUpOtp,
  login,
  signUp,
  verifyOtp,
  verifySignUpOtp,
} from "../../controllers/students";
import multer from "multer";
import otpAuth from "../../middleware/otpAuth";
import signUpOtpAuth from "../../middleware/signUpAuth";

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
router.post('/validate-otp',otpAuth,verifyOtp)
router.post('/signupOtp',getSignUpOtp)
router.post('/signupValidate',signUpOtpAuth,verifySignUpOtp)


export default router;
