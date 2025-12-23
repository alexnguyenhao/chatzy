import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  createPostSchema,
  updatePostSchema,
  getPostsSchema,
} from "../schemas/index.js";
import * as postController from "../controllers/post.controller.js";

const router = express.Router();

// Get news feed
router.get("/feed", verifyToken, postController.getFeed);

// Get user's posts
router.get(
  "/user/:userId",
  verifyToken,
  validateRequest(getPostsSchema),
  postController.getUserPosts
);

// Create post
router.post(
  "/",
  verifyToken,
  validateRequest(createPostSchema),
  postController.createPost
);

// Get post by ID
router.get("/:id", verifyToken, postController.getPostById);

// Update post
router.put(
  "/:id",
  verifyToken,
  validateRequest(updatePostSchema),
  postController.updatePost
);

// Delete post
router.delete("/:id", verifyToken, postController.deletePost);

// Share post
router.post("/:id/share", verifyToken, postController.sharePost);

// Get post comments
router.get("/:id/comments", verifyToken, postController.getComments);

// Get post likes
router.get("/:id/likes", verifyToken, postController.getLikes);

export default router;
