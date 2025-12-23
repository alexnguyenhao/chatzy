import { FriendRequest, BlockedUser, Chat } from "../models/index.js";
import {
  ConflictError,
  NotFoundError,
  ForbiddenError,
} from "../lib/errors.lib.js";

class FriendService {
  /**
   * Send friend request
   * @param {String} senderId
   * @param {String} receiverId
   * @param {String} message - Optional message
   */
  async sendFriendRequest(senderId, receiverId, message = "") {
    // Check if trying to add yourself
    if (senderId === receiverId) {
      throw new ConflictError("Không thể gửi lời mời kết bạn cho chính mình");
    }

    // Check if already friends or request exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingRequest) {
      if (existingRequest.status === "accepted") {
        throw new ConflictError("Đã là bạn bè");
      } else if (existingRequest.status === "pending") {
        throw new ConflictError("Lời mời kết bạn đã được gửi");
      }
    }

    // Check if blocked
    const isBlocked = await BlockedUser.findOne({
      $or: [
        { blocker: senderId, blocked: receiverId },
        { blocker: receiverId, blocked: senderId },
      ],
    });

    if (isBlocked) {
      throw new ForbiddenError("Không thể gửi lời mời kết bạn");
    }

    // Create friend request
    const request = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
      message,
      status: "pending",
    });

    // TODO: Create notification for receiver

    await request.populate("sender", "fullname avatar");
    return request;
  }

  /**
   * Accept friend request
   * @param {String} requestId
   * @param {String} userId
   */
  async acceptFriendRequest(requestId, userId) {
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      throw new NotFoundError("Lời mời kết bạn không tồn tại");
    }

    if (request.receiver.toString() !== userId) {
      throw new ForbiddenError("Bạn không có quyền chấp nhận lời mời này");
    }

    if (request.status !== "pending") {
      throw new ConflictError("Lời mời kết bạn đã được xử lý");
    }

    await request.accept();

    // TODO: Create notification for sender

    return request;
  }

  /**
   * Reject friend request
   * @param {String} requestId
   * @param {String} userId
   */
  async rejectFriendRequest(requestId, userId) {
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      throw new NotFoundError("Lời mời kết bạn không tồn tại");
    }

    if (request.receiver.toString() !== userId) {
      throw new ForbiddenError("Bạn không có quyền từ chối lời mời này");
    }

    await request.reject();
    return request;
  }

  /**
   * Cancel friend request
   * @param {String} requestId
   * @param {String} userId
   */
  async cancelFriendRequest(requestId, userId) {
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      throw new NotFoundError("Lời mời kết bạn không tồn tại");
    }

    if (request.sender.toString() !== userId) {
      throw new ForbiddenError("Bạn không có quyền hủy lời mời này");
    }

    await request.cancel();
    return request;
  }

  /**
   * Get friend requests (received)
   * @param {String} userId
   * @param {String} status - pending, accepted, rejected
   */
  async getFriendRequests(userId, status = "pending") {
    const requests = await FriendRequest.find({
      receiver: userId,
      status,
    })
      .populate("sender", "fullname avatar status")
      .sort("-createdAt");

    return requests;
  }

  /**
   * Get sent friend requests
   * @param {String} userId
   */
  async getSentRequests(userId) {
    const requests = await FriendRequest.find({
      sender: userId,
      status: "pending",
    })
      .populate("receiver", "fullname avatar status")
      .sort("-createdAt");

    return requests;
  }

  /**
   * Get friends list
   * @param {String} userId
   * @param {Object} options - { page, limit }
   */
  async getFriends(userId, options = {}) {
    const { page = 1, limit = 20 } = options;

    const requests = await FriendRequest.find({
      $or: [
        { sender: userId, status: "accepted" },
        { receiver: userId, status: "accepted" },
      ],
    })
      .populate("sender", "fullname avatar status lastSeen")
      .populate("receiver", "fullname avatar status lastSeen")
      .skip((page - 1) * limit)
      .limit(limit);

    const friends = requests.map((req) => {
      return req.sender._id.toString() === userId ? req.receiver : req.sender;
    });

    const total = await FriendRequest.countDocuments({
      $or: [
        { sender: userId, status: "accepted" },
        { receiver: userId, status: "accepted" },
      ],
    });

    return {
      data: friends,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Remove friend
   * @param {String} userId
   * @param {String} friendId
   */
  async removeFriend(userId, friendId) {
    const request = await FriendRequest.findOne({
      $or: [
        { sender: userId, receiver: friendId, status: "accepted" },
        { sender: friendId, receiver: userId, status: "accepted" },
      ],
    });

    if (!request) {
      throw new NotFoundError("Không tìm thấy mối quan hệ bạn bè");
    }

    // Delete the friend request
    await request.deleteOne();

    // TODO: Optionally delete or archive related chats

    return { message: "Đã xóa bạn bè" };
  }

  /**
   * Block user
   * @param {String} blockerId
   * @param {String} blockedId
   * @param {String} reason
   */
  async blockUser(blockerId, blockedId, reason = "") {
    // Check if already blocked
    const existingBlock = await BlockedUser.findOne({
      blocker: blockerId,
      blocked: blockedId,
    });

    if (existingBlock) {
      throw new ConflictError("Người dùng đã bị chặn");
    }

    // Create block
    const block = await BlockedUser.create({
      blocker: blockerId,
      blocked: blockedId,
      reason,
    });

    // Remove friend if exists
    await FriendRequest.deleteMany({
      $or: [
        { sender: blockerId, receiver: blockedId },
        { sender: blockedId, receiver: blockerId },
      ],
    });

    // Deactivate chats
    await Chat.updateMany(
      {
        type: "private",
        participants: { $all: [blockerId, blockedId] },
      },
      { isActive: false }
    );

    return block;
  }

  /**
   * Unblock user
   * @param {String} blockerId
   * @param {String} blockedId
   */
  async unblockUser(blockerId, blockedId) {
    const block = await BlockedUser.findOne({
      blocker: blockerId,
      blocked: blockedId,
    });

    if (!block) {
      throw new NotFoundError("Người dùng chưa bị chặn");
    }

    await block.deleteOne();
    return { message: "Đã bỏ chặn người dùng" };
  }

  /**
   * Get blocked users
   * @param {String} userId
   */
  async getBlockedUsers(userId) {
    const blocks = await BlockedUser.find({ blocker: userId }).populate(
      "blocked",
      "fullname avatar"
    );

    return blocks.map((b) => b.blocked);
  }

  /**
   * Check if friends
   * @param {String} userId1
   * @param {String} userId2
   */
  async areFriends(userId1, userId2) {
    const request = await FriendRequest.findOne({
      $or: [
        { sender: userId1, receiver: userId2, status: "accepted" },
        { sender: userId2, receiver: userId1, status: "accepted" },
      ],
    });

    return !!request;
  }

  /**
   * Check if blocked
   * @param {String} userId1
   * @param {String} userId2
   */
  async isBlocked(userId1, userId2) {
    const block = await BlockedUser.findOne({
      $or: [
        { blocker: userId1, blocked: userId2 },
        { blocker: userId2, blocked: userId1 },
      ],
    });

    return !!block;
  }
}

export default new FriendService();
