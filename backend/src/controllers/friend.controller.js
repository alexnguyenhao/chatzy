import friendService from "../services/friend.service.js";
import { sendSuccess, asyncHandler } from "../utils/response.utils.js";
import { getPaginationParams } from "../lib/pagination.lib.js";

/**
 * Send friend request
 * POST /api/friends/request
 */
export const sendFriendRequest = asyncHandler(async (req, res) => {
  const request = await friendService.sendFriendRequest(
    req.userId,
    req.body.receiverId,
    req.body.message
  );
  sendSuccess(res, 201, "Gửi lời mời kết bạn thành công", request);
});

/**
 * Accept friend request
 * POST /api/friends/request/:id/accept
 */
export const acceptFriendRequest = asyncHandler(async (req, res) => {
  await friendService.acceptFriendRequest(req.params.id, req.userId);
  sendSuccess(res, 200, "Đã chấp nhận lời mời kết bạn");
});

/**
 * Reject friend request
 * POST /api/friends/request/:id/reject
 */
export const rejectFriendRequest = asyncHandler(async (req, res) => {
  await friendService.rejectFriendRequest(req.params.id, req.userId);
  sendSuccess(res, 200, "Đã từ chối lời mời kết bạn");
});

/**
 * Cancel friend request
 * DELETE /api/friends/request/:id
 */
export const cancelFriendRequest = asyncHandler(async (req, res) => {
  await friendService.cancelFriendRequest(req.params.id, req.userId);
  sendSuccess(res, 200, "Đã hủy lời mời kết bạn");
});

/**
 * Get friend requests (received)
 * GET /api/friends/requests
 */
export const getFriendRequests = asyncHandler(async (req, res) => {
  const requests = await friendService.getFriendRequests(
    req.userId,
    req.query.status
  );
  sendSuccess(res, 200, "Success", requests);
});

/**
 * Get sent friend requests
 * GET /api/friends/requests/sent
 */
export const getSentRequests = asyncHandler(async (req, res) => {
  const requests = await friendService.getSentRequests(req.userId);
  sendSuccess(res, 200, "Success", requests);
});

/**
 * Get friends list
 * GET /api/friends
 */
export const getFriends = asyncHandler(async (req, res) => {
  const { page, limit } = getPaginationParams(req);
  const friends = await friendService.getFriends(req.userId, { page, limit });
  sendSuccess(res, 200, "Success", friends);
});

/**
 * Remove friend
 * DELETE /api/friends/:friendId
 */
export const removeFriend = asyncHandler(async (req, res) => {
  await friendService.removeFriend(req.userId, req.params.friendId);
  sendSuccess(res, 200, "Đã xóa bạn bè");
});

/**
 * Block user
 * POST /api/friends/block
 */
export const blockUser = asyncHandler(async (req, res) => {
  await friendService.blockUser(
    req.userId,
    req.body.blockedId,
    req.body.reason
  );
  sendSuccess(res, 200, "Đã chặn người dùng");
});

/**
 * Unblock user
 * DELETE /api/friends/block/:userId
 */
export const unblockUser = asyncHandler(async (req, res) => {
  await friendService.unblockUser(req.userId, req.params.userId);
  sendSuccess(res, 200, "Đã bỏ chặn người dùng");
});

/**
 * Get blocked users
 * GET /api/friends/blocked
 */
export const getBlockedUsers = asyncHandler(async (req, res) => {
  const blocked = await friendService.getBlockedUsers(req.userId);
  sendSuccess(res, 200, "Success", blocked);
});
