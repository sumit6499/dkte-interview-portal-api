import express from "express";
import { getPayment } from "../controllers/payment.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/:id/payments", auth, getPayment);

export default router;
