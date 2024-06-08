import express,{Request,Response,NextFunction} from "express";
import auth from "../middleware/auth";
import {
  updateStudent,
  getStudents,
  deleteStudent,
  getStudentInfo,
  uploadResume,
} from "../controllers/students";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// import { getPayment, postPayment } from "../controllers/payment.js";

const router = express.Router();

router.get("/:id/info", auth, getStudentInfo);
router.patch("/:id", auth, updateStudent);
router.get("/all", auth, getStudents);
router.delete("/:id", auth, deleteStudent);
router.patch("/:id/upload", upload.single("resume"), auth, uploadResume);

// router.post("/:id/payment", postPayment);
// router.get("/:id/payment", getPayment);
export default router;
