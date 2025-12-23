import logger from "../lib/logger.lib.js";

/**
 * Handle typing indicator events
 * @param {Socket} socket
 * @param {Server} io
 */
export const handleTypingEvents = (socket, io) => {
  /**
   * User started typing
   */
  socket.on("typing:start", (data) => {
    try {
      const { chatId } = data;

      // Notify others in chat
      socket.to(`chat:${chatId}`).emit("typing:start", {
        userId: socket.userId,
        chatId,
      });
    } catch (error) {
      logger.error("Error in typing start:", error);
    }
  });

  /**
   * User stopped typing
   */
  socket.on("typing:stop", (data) => {
    try {
      const { chatId } = data;

      socket.to(`chat:${chatId}`).emit("typing:stop", {
        userId: socket.userId,
        chatId,
      });
    } catch (error) {
      logger.error("Error in typing stop:", error);
    }
  });
};
