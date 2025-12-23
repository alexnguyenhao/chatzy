import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { createStorySchema, getStoriesSchema } from "../schemas/index.js";
import * as storyController from "../controllers/story.controller.js";

const router = express.Router();

// Get stories (active, not expired)
router.get(
  "/",
  verifyToken,
  validateRequest(getStoriesSchema),
  storyController.getStories
);

// Get user's stories
router.get("/user/:userId", verifyToken, storyController.getUserStories);

// Create story
router.post(
  "/",
  verifyToken,
  validateRequest(createStorySchema),
  storyController.createStory
);

// Delete story
router.delete("/:id", verifyToken, storyController.deleteStory);

// View story (mark as viewed)
router.post("/:id/view", verifyToken, storyController.viewStory);

export default router;
