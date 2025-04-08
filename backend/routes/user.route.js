import express from 'express';
import { createUser, getUser, loginUser, verifyCode } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.route("/createUser").post(createUser);
router.route("/:id").get(getUser);
router.route("/login").post(loginUser);
router.route("/verifyCode").post(verifyCode);

export default router;
