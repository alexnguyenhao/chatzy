import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import chatRoutes from "./chat.routes.js";
import messageRoutes from "./message.routes.js";
import postRoutes from "./post.routes.js";
import commentRoutes from "./comment.routes.js";
import friendRoutes from "./friend.routes.js";
import likeRoutes from "./like.routes.js";
import storyRoutes from "./story.routes.js";
import notificationRoutes from "./notification.routes.js";
import uploadRoutes from "./upload.routes.js";

const router = express.Router();

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// API routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/chats", chatRoutes);
router.use("/messages", messageRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/friends", friendRoutes);
router.use("/likes", likeRoutes);
router.use("/stories", storyRoutes);
router.use("/notifications", notificationRoutes);
router.use("/upload", uploadRoutes);

export default router;
