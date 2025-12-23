import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { uploadSingle } from "../config/multer.js";
import { updateProfileSchema, searchUsersSchema } from "../schemas/index.js";
import * as userController from "../controllers/user.controller.js";

const router = express.Router();

// Search users (protected)
router.get(
  "/search",
  verifyToken,
  validateRequest(searchUsersSchema),
  userController.searchUsers
);

// Update profile
router.put(
  "/profile",
  verifyToken,
  validateRequest(updateProfileSchema),
  userController.updateProfile
);

// Update status
router.put("/status", verifyToken, userController.updateStatus);

// Upload avatar
router.post(
  "/avatar",
  verifyToken,
  uploadSingle("avatar"),
  userController.uploadAvatar
);

// Get user by ID
router.get("/:id", verifyToken, userController.getUserById);

// Get user profile
router.get("/:id/profile", verifyToken, userController.getUserProfile);

// Get user's friends
router.get("/:id/friends", verifyToken, userController.getFriends);

export default router;
