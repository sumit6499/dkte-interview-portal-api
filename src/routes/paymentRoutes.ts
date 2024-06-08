import express from "express";
import { getPayment } from "../controllers/payment.ts";
import auth from "../middleware/auth.ts";

const router = express.Router();

router.get("/:id/payments", auth, getPayment);

export default router;
