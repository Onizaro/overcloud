
import express from 'express';
import { createUser, getAllUsers, getUser, loginUser, verifyCode, updateTwoFactorSettings, logoutUser } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Login, logout, and verifyCode don't require a token

router.route("/createUser").post(createUser);

router.route("/").get(getAllUsers) ;

router.route("/:id").get(getUser) 

router.route("/login").post(loginUser) ;

router.route("/logout").post(authenticateToken, logoutUser) ;

router.route("/verifyCode").post(verifyCode) ;

router.route("/updateFrequency").put(authenticateToken, updateTwoFactorSettings) ;

export default router;