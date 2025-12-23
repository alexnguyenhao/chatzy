import notificationService from "../services/notification.service.js";
import logger from "../lib/logger.lib.js";
import { getUserSocketId } from "./presence.socket.js";

/**
 * Handle notification events
 * @param {Socket} socket
 * @param {Server} io
 */
export const handleNotificationEvents = (socket, io) => {
  /**
   * Send notification to specific user
   */
  socket.on("notification:send", async (data) => {
    try {
      const { recipientId, type, title, message, link } = data;

      // Create notification in database
      const notification = await notificationService.createNotification({
        recipient: recipientId,
        sender: socket.userId,
        type,
        title,
        message,
        link,
      });

      // Send real-time notification if user is online
      const recipientSocketId = getUserSocketId(recipientId);
      if (recipientSocketId) {
        io.to(`user:${recipientId}`).emit("notification:new", notification);
      }
    } catch (error) {
      logger.error("Error sending notification:", error);
    }
  });

  /**
   * Mark notification as read
   */
  socket.on("notification:read", async (data) => {
    try {
      const { notificationId } = data;
      await notificationService.markAsRead(notificationId, socket.userId);

      socket.emit("notification:read:success", { notificationId });
    } catch (error) {
      logger.error("Error marking notification as read:", error);
    }
  });

  /**
   * Mark all notifications as read
   */
  socket.on("notification:read:all", async () => {
    try {
      await notificationService.markAllAsRead(socket.userId);
      socket.emit("notification:read:all:success");
    } catch (error) {
      logger.error("Error marking all notifications as read:", error);
    }
  });
};

/**
 * Send notification to user (used by other services)
 * @param {Server} io
 * @param {String} recipientId
 * @param {Object} notification
 */
export const sendNotificationToUser = (io, recipientId, notification) => {
  try {
    io.to(`user:${recipientId}`).emit("notification:new", notification);
  } catch (error) {
    logger.error("Error sending notification to user:", error);
  }
};
