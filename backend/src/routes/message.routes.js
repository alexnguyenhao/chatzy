import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  sendMessageSchema,
  editMessageSchema,
  getMessagesSchema,
} from "../schemas/index.js";
import * as messageController from "../controllers/message.controller.js";

const router = express.Router();

// Send message
router.post(
  "/",
  verifyToken,
  validateRequest(sendMessageSchema),
  messageController.sendMessage
);

// Get messages for a chat
router.get(
  "/:chatId",
  verifyToken,
  validateRequest(getMessagesSchema),
  messageController.getMessages
);

// Edit message
router.put(
  "/:id",
  verifyToken,
  validateRequest(editMessageSchema),
  messageController.editMessage
);

// Delete message
router.delete("/:id", verifyToken, messageController.deleteMessage);

// Mark as read
router.post("/:id/read", verifyToken, messageController.markAsRead);

// Mark as delivered
router.post("/:id/delivered", verifyToken, messageController.markAsDelivered);

export default router;
