import userService from "../services/user.service.js";
import {
  sendSuccess,
  sendError,
  asyncHandler,
} from "../utils/response.utils.js";
import { getPaginationParams } from "../lib/pagination.lib.js";

/**
 * Get user by ID
 * GET /api/users/:id
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  sendSuccess(res, 200, "Success", user);
});

/**
 * Get user profile
 * GET /api/users/:id/profile
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getUserProfile(req.params.id);
  sendSuccess(res, 200, "Success", profile);
});

/**
 * Update profile
 * PUT /api/users/profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.userId, req.body);
  sendSuccess(res, 200, "Cập nhật thành công", user);
});

/**
 * Search users
 * GET /api/users/search?query=...
 */
export const searchUsers = asyncHandler(async (req, res) => {
  const { page, limit } = getPaginationParams(req);
  const result = await userService.searchUsers(req.query.query, {
    page,
    limit,
  });
  sendSuccess(res, 200, "Success", result);
});

/**
 * Get user's friends
 * GET /api/users/:id/friends
 */
export const getFriends = asyncHandler(async (req, res) => {
  const { page, limit } = getPaginationParams(req);
  const result = await userService.getFriends(req.params.id, { page, limit });
  sendSuccess(res, 200, "Success", result);
});

/**
 * Update status
 * PUT /api/users/status
 */
export const updateStatus = asyncHandler(async (req, res) => {
  await userService.updateStatus(req.userId, req.body.status);
  sendSuccess(res, 200, "Cập nhật trạng thái thành công");
});

/**
 * Upload avatar
 * POST /api/users/avatar
 */
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendError(res, 400, "Không có file được upload");
  }

  // Upload to Cloudinary using StorageService
  const storageService = (await import("../services/storage.service.js"))
    .default;
  const uploadResult = await storageService.uploadAvatar(
    req.file.buffer,
    req.userId
  );

  // Update user avatar URL
  const user = await userService.updateProfile(req.userId, {
    avatar: uploadResult.url,
  });

  sendSuccess(res, 200, "Upload avatar thành công", {
    avatar: uploadResult.url,
  });
});
