import userService from "../services/user.service.js";
import logger from "../lib/logger.lib.js";

// Store online users: userId -> socketId
const onlineUsers = new Map();

/**
 * Handle user presence events
 * @param {Socket} socket
 * @param {Server} io
 */
export const handlePresenceEvents = (socket, io) => {
  /**
   * User goes online
   */
  const handleUserOnline = async () => {
    try {
      const userId = socket.userId;

      // Add to online users
      onlineUsers.set(userId, socket.id);

      // Update status in database
      await userService.updateStatus(userId, "online");

      // Join user's personal room
      socket.join(`user:${userId}`);

      // Broadcast to all connected clients
      io.emit("user:online", {
        userId,
        status: "online",
        timestamp: new Date(),
      });

      logger.info(`User ${userId} is now online`);
    } catch (error) {
      logger.error("Error setting user online:", error);
    }
  };

  /**
   * User goes offline
   */
  const handleUserOffline = async () => {
    try {
      const userId = socket.userId;

      // Remove from online users
      onlineUsers.delete(userId);

      // Update status in database
      await userService.updateStatus(userId, "offline");

      // Broadcast to all connected clients
      io.emit("user:offline", {
        userId,
        status: "offline",
        lastSeen: new Date(),
      });

      logger.info(`User ${userId} is now offline`);
    } catch (error) {
      logger.error("Error setting user offline:", error);
    }
  };

  /**
   * User updates status (away, busy, etc.)
   */
  socket.on("status:update", async (data) => {
    try {
      const { status } = data; // online, offline, away, busy
      await userService.updateStatus(socket.userId, status);

      // Broadcast status change
      io.emit("user:status", {
        userId: socket.userId,
        status,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error("Error updating status:", error);
      socket.emit("error", { message: "Không thể cập nhật trạng thái" });
    }
  });

  /**
   * Get online users
   */
  socket.on("users:online", () => {
    try {
      const onlineUserIds = Array.from(onlineUsers.keys());
      socket.emit("users:online", onlineUserIds);
    } catch (error) {
      logger.error("Error getting online users:", error);
    }
  });

  // Set user online when socket connects
  handleUserOnline();

  // Set user offline when socket disconnects
  socket.on("disconnect", handleUserOffline);
};

/**
 * Get online users map
 */
export const getOnlineUsers = () => onlineUsers;

/**
 * Check if user is online
 */
export const isUserOnline = (userId) => onlineUsers.has(userId);

/**
 * Get user socket ID
 */
export const getUserSocketId = (userId) => onlineUsers.get(userId);
