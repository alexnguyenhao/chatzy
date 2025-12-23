import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { toggleLikeSchema } from "../schemas/index.js";
import * as likeController from "../controllers/like.controller.js";

const router = express.Router();

// Toggle like/unlike
router.post(
  "/",
  verifyToken,
  validateRequest(toggleLikeSchema),
  likeController.toggleLike
);

// Get likes for a target (Post or Comment)
router.get("/:targetType/:targetId", verifyToken, likeController.getLikes);

export default router;
