import express from "express";
import { checkAuth, forgotPassword, login, logout, resetPassword, signup, updateProfile, verifyEmail } from "../controller/user.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router.route("/check-auth").get(isAuthenticated as any, checkAuth as any);
router.route("/signup").post(signup as any);
router.route("/login").post(login as any);
router.route("/logout").post(logout as any);
router.route("/verify-email").post(verifyEmail as any);
router.route("/forgot-password").post(forgotPassword as any);
router.route("/reset-password/:token").post(resetPassword as any);
router.route("/profile/update").put(isAuthenticated as any,updateProfile as any);

 export default router;