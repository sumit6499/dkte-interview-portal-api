import express from "express";
import auth from '../middleware/auth.js'
import {updateAdmin} from '../controllers/admin.js'

const router = express.Router();

router.patch("/:id", auth, updateAdmin);


export default router;
