import express from "express";
import auth from '../middleware/auth.ts'
import {updateAdmin} from '../controllers/admin.ts'

const router = express.Router();

router.patch("/:id", auth, updateAdmin);


export default router;
