import messageService from "../services/message.service.js";
import userService from "../services/user.service.js";
import logger from "../lib/logger.lib.js";

/**
 * Handle chat-related socket events
 * @param {Socket} socket
 * @param {Server} io
 */
export const handleChatEvents = (socket, io) => {
  /**
   * Join a chat room
   */
  socket.on("chat:join", async (chatId) => {
    try {
      socket.join(`chat:${chatId}`);
      logger.info(`User ${socket.userId} joined chat ${chatId}`);

      // Notify others in the room
      socket.to(`chat:${chatId}`).emit("user:joined", {
        userId: socket.userId,
        chatId,
      });
    } catch (error) {
      logger.error("Error joining chat:", error);
      socket.emit("error", { message: "Không thể tham gia chat" });
    }
  });

  /**
   * Leave a chat room
   */
  socket.on("chat:leave", async (chatId) => {
    try {
      socket.leave(`chat:${chatId}`);
      logger.info(`User ${socket.userId} left chat ${chatId}`);

      socket.to(`chat:${chatId}`).emit("user:left", {
        userId: socket.userId,
        chatId,
      });
    } catch (error) {
      logger.error("Error leaving chat:", error);
    }
  });

  /**
   * Send message
   */
  socket.on("message:send", async (data) => {
    try {
      const { chatId, type, content, media, replyTo } = data;

      // Send message via service
      const message = await messageService.sendMessage({
        chatId,
        senderId: socket.userId,
        type,
        content,
        media,
        replyTo,
      });

      // Emit to all users in chat
      io.to(`chat:${chatId}`).emit("message:new", message);

      // TODO: Send push notification to offline users
    } catch (error) {
      logger.error("Error sending message:", error);
      socket.emit("error", { message: "Không thể gửi tin nhắn" });
    }
  });

  /**
   * Mark message as delivered
   */
  socket.on("message:delivered", async (data) => {
    try {
      const { messageId } = data;
      await messageService.markAsDelivered(messageId, socket.userId);

      // Notify sender
      socket.to(`chat:${data.chatId}`).emit("message:delivered", {
        messageId,
        userId: socket.userId,
      });
    } catch (error) {
      logger.error("Error marking as delivered:", error);
    }
  });

  /**
   * Mark message as read
   */
  socket.on("message:read", async (data) => {
    try {
      const { messageId, chatId } = data;
      await messageService.markAsRead(messageId, socket.userId);

      // Notify sender
      socket.to(`chat:${chatId}`).emit("message:read", {
        messageId,
        userId: socket.userId,
      });
    } catch (error) {
      logger.error("Error marking as read:", error);
    }
  });

  /**
   * Edit message
   */
  socket.on("message:edit", async (data) => {
    try {
      const { messageId, content, chatId } = data;
      const message = await messageService.editMessage(
        messageId,
        socket.userId,
        content
      );

      // Notify all users in chat
      io.to(`chat:${chatId}`).emit("message:edited", message);
    } catch (error) {
      logger.error("Error editing message:", error);
      socket.emit("error", { message: "Không thể chỉnh sửa tin nhắn" });
    }
  });

  /**
   * Delete message
   */
  socket.on("message:delete", async (data) => {
    try {
      const { messageId, chatId, deleteForEveryone } = data;
      await messageService.deleteMessage(
        messageId,
        socket.userId,
        deleteForEveryone
      );

      if (deleteForEveryone) {
        // Notify all users
        io.to(`chat:${chatId}`).emit("message:deleted", {
          messageId,
          deletedBy: socket.userId,
        });
      } else {
        // Only notify sender
        socket.emit("message:deleted", {
          messageId,
          deletedBy: socket.userId,
        });
      }
    } catch (error) {
      logger.error("Error deleting message:", error);
      socket.emit("error", { message: "Không thể xóa tin nhắn" });
    }
  });
};
