import dotenv from "dotenv";
import { createServer } from "http";
import app from "./app.js";
import { initSocket } from "./config/socket.js";
import { connectDB } from "./config/db.js";
import { setupCloudinary } from "./config/cloudinary.js";
import logger from "./lib/logger.lib.js";

dotenv.config();

const httpServer = createServer(app);
const io = initSocket(httpServer);

const PORT = process.env.PORT || 5000;

// Initialize database and cloudinary
const startServer = async () => {
  try {
    await connectDB();
    // Setup Cloudinary
    setupCloudinary();

    // Initialize Socket.IO handlers
    const { initializeSocketHandlers } = await import("./sockets/index.js");
    initializeSocketHandlers(io);

    // Start server
    httpServer.listen(PORT, () => {
      logger.success(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
