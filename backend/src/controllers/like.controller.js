import { sendSuccess, asyncHandler } from "../utils/response.utils.js";
import { Like } from "../models/index.js";
import { ConflictError } from "../lib/errors.lib.js";

/**
 * Toggle like (like/unlike)
 * POST /api/likes
 */
export const toggleLike = asyncHandler(async (req, res) => {
  const { targetType, targetId, reactionType } = req.body;

  // Check if already liked
  const existingLike = await Like.findOne({
    user: req.userId,
    targetType,
    [targetType === "Post" ? "post" : "comment"]: targetId,
  });

  if (existingLike) {
    // Unlike
    await existingLike.deleteOne();
    sendSuccess(res, 200, "Đã bỏ thích");
  } else {
    // Like
    const likeData = {
      user: req.userId,
      targetType,
      reactionType: reactionType || "like",
    };

    if (targetType === "Post") {
      likeData.post = targetId;
    } else {
      likeData.comment = targetId;
    }

    const like = await Like.create(likeData);
    sendSuccess(res, 201, "Đã thích", like);
  }
});

/**
 * Get likes for a target
 * GET /api/likes/:targetType/:targetId
 */
export const getLikes = asyncHandler(async (req, res) => {
  const { targetType, targetId } = req.params;

  const likes = await Like.find({
    targetType,
    [targetType === "Post" ? "post" : "comment"]: targetId,
  }).populate("user", "fullname avatar");

  sendSuccess(res, 200, "Success", likes);
});
