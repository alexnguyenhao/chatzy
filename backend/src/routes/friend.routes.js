import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { sendFriendRequestSchema, blockUserSchema } from "../schemas/index.js";
import * as friendController from "../controllers/friend.controller.js";

const router = express.Router();

// Get friends list
router.get("/", verifyToken, friendController.getFriends);

// Get friend requests (received)
router.get("/requests", verifyToken, friendController.getFriendRequests);

// Get sent friend requests
router.get("/requests/sent", verifyToken, friendController.getSentRequests);

// Send friend request
router.post(
  "/request",
  verifyToken,
  validateRequest(sendFriendRequestSchema),
  friendController.sendFriendRequest
);

// Accept friend request
router.post(
  "/request/:id/accept",
  verifyToken,
  friendController.acceptFriendRequest
);

// Reject friend request
router.post(
  "/request/:id/reject",
  verifyToken,
  friendController.rejectFriendRequest
);

// Cancel friend request
router.delete(
  "/request/:id",
  verifyToken,
  friendController.cancelFriendRequest
);

// Remove friend
router.delete("/:friendId", verifyToken, friendController.removeFriend);

// Get blocked users
router.get("/blocked", verifyToken, friendController.getBlockedUsers);

// Block user
router.post(
  "/block",
  verifyToken,
  validateRequest(blockUserSchema),
  friendController.blockUser
);

// Unblock user
router.delete("/block/:userId", verifyToken, friendController.unblockUser);

export default router;
