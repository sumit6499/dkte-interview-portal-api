"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const students_1 = require("../controllers/students");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
// import { getPayment, postPayment } from "../controllers/payment.js";
const router = express_1.default.Router();
router.get("/:id/info", auth_1.default, students_1.getStudentInfo);
router.patch("/:id", auth_1.default, students_1.updateStudent);
router.get("/all", auth_1.default, students_1.getStudents);
router.delete("/:id", auth_1.default, students_1.deleteStudent);
router.patch("/:id/upload", upload.single("resume"), auth_1.default, students_1.uploadResume);
// router.post("/:id/payment", postPayment);
// router.get("/:id/payment", getPayment);
exports.default = router;
//# sourceMappingURL=studentRoutes.js.map