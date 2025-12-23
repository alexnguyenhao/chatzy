import { verifyToken as verifyJWT } from "../utils/jwt.utils.js";
import logger from "../lib/logger.lib.js";
import { handleChatEvents } from "./chat.socket.js";
import { handleTypingEvents } from "./typing.socket.js";
import { handlePresenceEvents } from "./presence.socket.js";
import { handleNotificationEvents } from "./notification.socket.js";

/**
 * Initialize Socket.IO handlers
 * @param {Server} io - Socket.IO server instance
 */
export const initializeSocketHandlers = (io) => {
  // Middleware: Authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication token required"));
      }

      // Verify JWT token
      const decoded = verifyJWT(token);
      socket.userId = decoded.userId;
      socket.userEmail = decoded.email;

      logger.info(`Socket authenticated for user: ${socket.userId}`);
      next();
    } catch (error) {
      logger.error("Socket authentication error:", error);
      next(new Error("Authentication failed"));
    }
  });

  // Handle connections
  io.on("connection", (socket) => {
    logger.success(
      `New socket connection: ${socket.id} (User: ${socket.userId})`
    );

    // Register event handlers
    handleChatEvents(socket, io);
    handleTypingEvents(socket, io);
    handlePresenceEvents(socket, io);
    handleNotificationEvents(socket, io);

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      logger.info(
        `Socket disconnected: ${socket.id} (User: ${socket.userId}) - Reason: ${reason}`
      );
    });

    // Handle errors
    socket.on("error", (error) => {
      logger.error(`Socket error for ${socket.id}:`, error);
    });
  });

  logger.success("Socket.IO handlers initialized");
};

export default initializeSocketHandlers;
