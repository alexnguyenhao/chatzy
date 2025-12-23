import { Chat, FriendRequest, BlockedUser } from "../models/index.js";
import { NotFoundError, ForbiddenError } from "../lib/errors.lib.js";

class ChatService {
  /**
   * Create or get private chat
   * @param {String} userId1
   * @param {String} userId2
   */
  async createOrGetPrivateChat(userId1, userId2) {
    // Check if blocked
    const isBlocked = await BlockedUser.findOne({
      $or: [
        { blocker: userId1, blocked: userId2 },
        { blocker: userId2, blocked: userId1 },
      ],
    });

    if (isBlocked) {
      throw new ForbiddenError("Không thể chat với người dùng đã bị chặn");
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      type: "private",
      participants: { $all: [userId1, userId2] },
    });

    if (existingChat) {
      return existingChat;
    }

    // Check if they are friends
    const areFriends = await FriendRequest.findOne({
      $or: [
        { sender: userId1, receiver: userId2, status: "accepted" },
        { sender: userId2, receiver: userId1, status: "accepted" },
      ],
    });

    // Create new chat
    const chat = await Chat.create({
      type: "private",
      participants: [userId1, userId2],
      isMessageRequest: !areFriends, // Mark as message request if not friends
    });

    return chat;
  }

  /**
   * Get chats for user
   * @param {String} userId
   * @param {Object} options - { includeMessageRequests }
   */
  async getChatsForUser(userId, options = {}) {
    const { includeMessageRequests = false } = options;

    const query = {
      participants: userId,
      isActive: true,
    };

    // Filter message requests
    if (!includeMessageRequests) {
      query.isMessageRequest = false;
    }

    const chats = await Chat.find(query)
      .populate("participants", "fullname avatar status")
      .populate("lastMessage")
      .sort("-lastMessageAt");

    return chats;
  }

  /**
   * Get message requests
   * @param {String} userId
   */
  async getMessageRequests(userId) {
    const requests = await Chat.find({
      participants: userId,
      isActive: true,
      isMessageRequest: true,
    })
      .populate("participants", "fullname avatar")
      .populate("lastMessage")
      .sort("-lastMessageAt");

    return requests;
  }

  /**
   * Accept message request
   * @param {String} chatId
   * @param {String} userId
   */
  async acceptMessageRequest(chatId, userId) {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      throw new NotFoundError("Chat không tồn tại");
    }

    // Check if user is participant
    if (!chat.participants.includes(userId)) {
      throw new ForbiddenError("Bạn không phải thành viên của chat này");
    }

    // Accept message request
    await chat.acceptMessageRequest();

    return chat;
  }

  /**
   * Decline/delete message request
   * @param {String} chatId
   * @param {String} userId
   */
  async declineMessageRequest(chatId, userId) {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      throw new NotFoundError("Chat không tồn tại");
    }

    // Check if user is participant
    if (!chat.participants.includes(userId)) {
      throw new ForbiddenError("Bạn không phải thành viên của chat này");
    }

    // Delete chat
    chat.isActive = false;
    await chat.save();

    return { message: "Đã từ chối message request" };
  }

  /**
   * Get chat by ID
   * @param {String} chatId
   * @param {String} userId - For authorization
   */
  async getChatById(chatId, userId) {
    const chat = await Chat.findById(chatId)
      .populate("participants", "fullname avatar status")
      .populate("lastMessage");

    if (!chat) {
      throw new NotFoundError("Chat không tồn tại");
    }

    // Check if user is participant
    if (!chat.participants.some((p) => p._id.toString() === userId)) {
      throw new ForbiddenError("Bạn không có quyền truy cập chat này");
    }

    return chat;
  }

  /**
   * Update chat (group name, avatar, description)
   * @param {String} chatId
   * @param {String} userId
   * @param {Object} updateData - { name, avatar, description }
   */
  async updateChat(chatId, userId, updateData) {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      throw new NotFoundError("Chat không tồn tại");
    }

    // Check if user is admin (for group chats) or participant
    if (chat.type === "group" && chat.admin.toString() !== userId) {
      throw new ForbiddenError("Chỉ admin mới có thể cập nhật thông tin nhóm");
    }

    if (!chat.participants.includes(userId)) {
      throw new ForbiddenError("Bạn không phải thành viên của chat này");
    }

    // Update allowed fields
    if (updateData.name) chat.name = updateData.name;
    if (updateData.avatar) chat.avatar = updateData.avatar;
    if (updateData.description) chat.description = updateData.description;

    await chat.save();
    return chat;
  }

  /**
   * Delete/deactivate chat
   * @param {String} chatId
   * @param {String} userId
   */
  async deleteChat(chatId, userId) {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      throw new NotFoundError("Chat không tồn tại");
    }

    // For group: only admin can delete
    // For private: any participant can delete
    if (chat.type === "group" && chat.admin.toString() !== userId) {
      throw new ForbiddenError("Chỉ admin mới có thể xóa nhóm");
    }

    if (!chat.participants.includes(userId)) {
      throw new ForbiddenError("Bạn không phải thành viên của chat này");
    }

    // Soft delete
    chat.isActive = false;
    await chat.save();

    return { message: "Đã xóa chat" };
  }

  /**
   * Add participant to group chat
   * @param {String} chatId
   * @param {String} userId - Who is adding
   * @param {String} newParticipantId
   */
  async addParticipant(chatId, userId, newParticipantId) {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      throw new NotFoundError("Chat không tồn tại");
    }

    if (chat.type !== "group") {
      throw new ForbiddenError("Chỉ có thể thêm thành viên vào nhóm");
    }

    // Check if user is admin
    if (chat.admin.toString() !== userId) {
      throw new ForbiddenError("Chỉ admin mới có thể thêm thành viên");
    }

    // Add participant
    await chat.addParticipant(newParticipantId);

    return chat;
  }

  /**
   * Remove participant from group chat
   * @param {String} chatId
   * @param {String} userId - Who is removing
   * @param {String} participantId - Who to remove
   */
  async removeParticipant(chatId, userId, participantId) {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      throw new NotFoundError("Chat không tồn tại");
    }

    if (chat.type !== "group") {
      throw new ForbiddenError("Chỉ có thể xóa thành viên khỏi nhóm");
    }

    // Check if user is admin or removing themselves
    const isAdmin = chat.admin.toString() === userId;
    const isSelf = userId === participantId;

    if (!isAdmin && !isSelf) {
      throw new ForbiddenError(
        "Chỉ admin hoặc bản thân mới có thể xóa thành viên"
      );
    }

    // Remove participant
    await chat.removeParticipant(participantId);

    return { message: "Đã xóa thành viên" };
  }
}

export default new ChatService();
