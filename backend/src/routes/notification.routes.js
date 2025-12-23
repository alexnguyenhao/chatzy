import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import * as notificationController from "../controllers/notification.controller.js";

const router = express.Router();

// Get notifications for user
router.get("/", verifyToken, notificationController.getNotifications);

// Mark all as read
router.put("/read-all", verifyToken, notificationController.markAllAsRead);

// Mark notification as read
router.put("/:id/read", verifyToken, notificationController.markAsRead);

// Delete notification
router.delete("/:id", verifyToken, notificationController.deleteNotification);

export default router;
