import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  createChatSchema,
  updateChatSchema,
  addParticipantSchema,
} from "../schemas/index.js";
import * as chatController from "../controllers/chat.controller.js";

const router = express.Router();

// Get all chats for user
router.get("/", verifyToken, chatController.getChats);

// Get message requests
router.get("/requests", verifyToken, chatController.getMessageRequests);

// Create new chat
router.post(
  "/",
  verifyToken,
  validateRequest(createChatSchema),
  chatController.createChat
);

// Get chat by ID
router.get("/:id", verifyToken, chatController.getChatById);

// Update chat
router.put(
  "/:id",
  verifyToken,
  validateRequest(updateChatSchema),
  chatController.updateChat
);

// Delete chat
router.delete("/:id", verifyToken, chatController.deleteChat);

// Add participant
router.post(
  "/:id/participants",
  verifyToken,
  validateRequest(addParticipantSchema),
  chatController.addParticipant
);

// Accept message request
router.post("/:id/accept", verifyToken, chatController.acceptMessageRequest);

// Decline message request
router.post("/:id/decline", verifyToken, chatController.declineMessageRequest);

// Remove participant
router.delete(
  "/:id/participants/:userId",
  verifyToken,
  chatController.removeParticipant
);

export default router;
