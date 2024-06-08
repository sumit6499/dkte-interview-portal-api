import express from "express";
import { getPayment } from "../controllers/payment";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/:id/payments", auth, getPayment);

export default router;
