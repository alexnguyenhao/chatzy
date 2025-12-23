import { sendSuccess, asyncHandler } from "../utils/response.utils.js";
import { Comment } from "../models/index.js";
import { getPaginationParams } from "../lib/pagination.lib.js";
import { NotFoundError } from "../lib/errors.lib.js";

/**
 * Create comment
 * POST /api/comments
 */
export const createComment = asyncHandler(async (req, res) => {
  const commentData = {
    ...req.body,
    author: req.userId,
  };

  const comment = await Comment.create(commentData);
  await comment.populate("author", "fullname avatar");

  sendSuccess(res, 201, "Bình luận thành công", comment);
});

/**
 * Update comment
 * PUT /api/comments/:id
 */
export const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    throw new NotFoundError("Bình luận không tồn tại");
  }

  if (comment.author.toString() !== req.userId) {
    throw new ForbiddenError("Không có quyền chỉnh sửa");
  }

  await comment.edit(req.body.content);
  sendSuccess(res, 200, "Chỉnh sửa thành công", comment);
});

/**
 * Delete comment
 * DELETE /api/comments/:id
 */
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    throw new NotFoundError("Bình luận không tồn tại");
  }

  if (comment.author.toString() !== req.userId) {
    throw new ForbiddenError("Không có quyền xóa");
  }

  await comment.softDelete();
  sendSuccess(res, 200, "Xóa bình luận thành công");
});

/**
 * Get comment replies
 * GET /api/comments/:id/replies
 */
export const getReplies = asyncHandler(async (req, res) => {
  const { page, limit } = getPaginationParams(req);

  const replies = await Comment.find({
    parentComment: req.params.id,
    isDeleted: false,
  })
    .populate("author", "fullname avatar")
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit);

  sendSuccess(res, 200, "Success", replies);
});
