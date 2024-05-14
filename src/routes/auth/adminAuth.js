import express from "express";
import { signUp, login } from "../../controllers/admin.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/login", login);
router.post(
  "/signup",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "idCard", maxCount: 1 },
  ]),
  signUp
);

export default router;
