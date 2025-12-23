import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  createCommentSchema,
  updateCommentSchema,
  getCommentsSchema,
} from "../schemas/index.js";
import * as commentController from "../controllers/comment.controller.js";

const router = express.Router();

// Create comment
router.post(
  "/",
  verifyToken,
  validateRequest(createCommentSchema),
  commentController.createComment
);

// Update comment
router.put(
  "/:id",
  verifyToken,
  validateRequest(updateCommentSchema),
  commentController.updateComment
);

// Delete comment
router.delete("/:id", verifyToken, commentController.deleteComment);

// Get comment replies
router.get(
  "/:id/replies",
  verifyToken,
  validateRequest(getCommentsSchema),
  commentController.getReplies
);

export default router;
