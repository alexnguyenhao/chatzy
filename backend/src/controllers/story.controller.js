import { sendSuccess, asyncHandler } from "../utils/response.utils.js";
import { Story } from "../models/index.js";
import { getPaginationParams } from "../lib/pagination.lib.js";
import { NotFoundError } from "../lib/errors.lib.js";

/**
 * Get stories (active, not expired)
 * GET /api/stories
 */
export const getStories = asyncHandler(async (req, res) => {
  const { page, limit } = getPaginationParams(req);

  const stories = await Story.find({
    isActive: true,
    expiresAt: { $gt: new Date() },
  })
    .populate("author", "fullname avatar")
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit);

  sendSuccess(res, 200, "Success", stories);
});

/**
 * Get user's stories
 * GET /api/stories/user/:userId
 */
export const getUserStories = asyncHandler(async (req, res) => {
  const stories = await Story.find({
    author: req.params.userId,
    isActive: true,
    expiresAt: { $gt: new Date() },
  })
    .populate("author", "fullname avatar")
    .sort("-createdAt");

  sendSuccess(res, 200, "Success", stories);
});

/**
 * Create story
 * POST /api/stories
 */
export const createStory = asyncHandler(async (req, res) => {
  const storyData = {
    ...req.body,
    author: req.userId,
  };

  const story = await Story.create(storyData);
  sendSuccess(res, 201, "Tạo story thành công", story);
});

/**
 * Delete story
 * DELETE /api/stories/:id
 */
export const deleteStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    throw new NotFoundError("Story không tồn tại");
  }

  if (story.author.toString() !== req.userId) {
    throw new ForbiddenError("Không có quyền xóa");
  }

  story.isActive = false;
  await story.save();

  sendSuccess(res, 200, "Xóa story thành công");
});

/**
 * View story (mark as viewed)
 * POST /api/stories/:id/view
 */
export const viewStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    throw new NotFoundError("Story không tồn tại");
  }

  await story.addViewer(req.userId);
  sendSuccess(res, 200, "Đã xem story");
});
