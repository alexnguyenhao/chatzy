import postService from "../services/post.service.js";
import { sendSuccess, asyncHandler } from "../utils/response.utils.js";
import { getPaginationParams } from "../lib/pagination.lib.js";

/**
 * Get news feed
 * GET /api/posts/feed
 */
export const getFeed = asyncHandler(async (req, res) => {
  const { page, limit } = getPaginationParams(req);
  const feed = await postService.getFeed(req.userId, { page, limit });
  sendSuccess(res, 200, "Success", feed);
});

/**
 * Get post by ID
 * GET /api/posts/:id
 */
export const getPostById = asyncHandler(async (req, res) => {
  const post = await postService.getPostById(req.params.id, req.userId);
  sendSuccess(res, 200, "Success", post);
});

/**
 * Get user's posts
 * GET /api/posts/user/:userId
 */
export const getUserPosts = asyncHandler(async (req, res) => {
  const { page, limit } = getPaginationParams(req);
  const posts = await postService.getUserPosts(req.params.userId, {
    page,
    limit,
  });
  sendSuccess(res, 200, "Success", posts);
});

/**
 * Create post
 * POST /api/posts
 */
export const createPost = asyncHandler(async (req, res) => {
  const postData = {
    ...req.body,
    authorId: req.userId,
  };

  const post = await postService.createPost(postData);
  sendSuccess(res, 201, "Đăng bài thành công", post);
});

/**
 * Update post
 * PUT /api/posts/:id
 */
export const updatePost = asyncHandler(async (req, res) => {
  const post = await postService.updatePost(
    req.params.id,
    req.userId,
    req.body
  );
  sendSuccess(res, 200, "Cập nhật bài viết thành công", post);
});

/**
 * Delete post
 * DELETE /api/posts/:id
 */
export const deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.id, req.userId);
  sendSuccess(res, 200, "Xóa bài viết thành công");
});

/**
 * Share post
 * POST /api/posts/:id/share
 */
export const sharePost = asyncHandler(async (req, res) => {
  const post = await postService.sharePost(
    req.params.id,
    req.userId,
    req.body.content
  );
  sendSuccess(res, 201, "Chia sẻ bài viết thành công", post);
});

/**
 * Get post comments
 * GET /api/posts/:id/comments
 */
export const getComments = asyncHandler(async (req, res) => {
  const { page, limit } = getPaginationParams(req);
  const comments = await postService.getComments(req.params.id, {
    page,
    limit,
  });
  sendSuccess(res, 200, "Success", comments);
});

/**
 * Get post likes
 * GET /api/posts/:id/likes
 */
export const getLikes = asyncHandler(async (req, res) => {
  const { page, limit } = getPaginationParams(req);
  const likes = await postService.getLikes(req.params.id, { page, limit });
  sendSuccess(res, 200, "Success", likes);
});
