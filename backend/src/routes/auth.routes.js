import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { strictRateLimiter } from "../middleware/rateLimiter.middleware.js";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from "../schemas/index.js";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

// Public routes with strict rate limiting
router.post(
  "/register",
  strictRateLimiter,
  validateRequest(registerSchema),
  authController.register
);

router.post(
  "/login",
  strictRateLimiter,
  validateRequest(loginSchema),
  authController.login
);

router.post(
  "/reset-password-request",
  strictRateLimiter,
  validateRequest(resetPasswordRequestSchema),
  authController.resetPasswordRequest
);

router.post(
  "/reset-password",
  strictRateLimiter,
  validateRequest(resetPasswordSchema),
  authController.resetPassword
);

// Protected routes
router.post("/logout", verifyToken, authController.logout);

router.get("/me", verifyToken, authController.getCurrentUser);

router.post(
  "/change-password",
  verifyToken,
  validateRequest(changePasswordSchema),
  authController.changePassword
);

router.post("/refresh-token", verifyToken, authController.refreshToken);

export default router;
