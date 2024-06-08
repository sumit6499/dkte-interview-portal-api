import express from "express";
import auth from '../middleware/auth'
import {updateAdmin} from '../controllers/admin'

const router = express.Router();

router.patch("/:id", auth, updateAdmin);


export default router;
