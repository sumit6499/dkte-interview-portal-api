"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const students_1 = require("../../controllers/students");
const multer_1 = __importDefault(require("multer"));
const otpAuth_1 = __importDefault(require("../../middleware/otpAuth"));
const signUpAuth_1 = __importDefault(require("../../middleware/signUpAuth"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = express_1.default.Router();
router.post("/login", students_1.login);
router.post("/signup", upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "idCard", maxCount: 1 },
    { name: "paymentImage", maxCount: 1 },
]), students_1.signUp);
router.post("/otp", students_1.getOtpEmail);
router.post('/validate-otp', otpAuth_1.default, students_1.verifyOtp);
router.post('/signupOtp', students_1.getSignUpOtp);
router.post('/signupValidate', signUpAuth_1.default, students_1.verifySignUpOtp);
exports.default = router;
//# sourceMappingURL=studentAuth.js.map