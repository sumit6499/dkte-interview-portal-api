import express from "express";
import auth from "../middleware/auth.js";
import {
  updateStudent,
  getStudent,
  deleteStudent,
} from "../controllers/students.js";

// import { getPayment, postPayment } from "../controllers/payment.js";

const router = express.Router();

router.patch("/:id", auth, updateStudent);
router.get("/all", auth, getStudent);
router.delete("/:id", deleteStudent);
// router.post("/:id/payment", postPayment);
// router.get("/:id/payment", getPayment);
export default router;
