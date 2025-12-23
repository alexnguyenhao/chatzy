import { Message, Chat } from "../models/index.js";
import { NotFoundError, ForbiddenError } from "../lib/errors.lib.js";
import { paginate } from "../lib/pagination.lib.js";

class MessageService {
  /**
   * Send a new message
   * @param {Object} data - { chatId, senderId, type, content, media, replyTo }
   */
  async sendMessage(data) {
    const { chatId, senderId, type, content, media, replyTo } = data;

    // Validate chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new NotFoundError("Chat không tồn tại");
    }

    // Check if sender is participant
    if (!chat.participants.includes(senderId)) {
      throw new ForbiddenError("Bạn không phải thành viên của chat này");
    }

    // Create message
    const message = await Message.create({
      chat: chatId,
      sender: senderId,
      type,
      content,
      media,
      replyTo,
    });

    // Update chat's last message
    chat.lastMessage = message._id;
    chat.lastMessageAt = new Date();

    // Increment unread count for other participants
    chat.participants.forEach((participantId) => {
      if (participantId.toString() !== senderId.toString()) {
        const currentCount =
          chat.unreadCount.get(participantId.toString()) || 0;
        chat.unreadCount.set(participantId.toString(), currentCount + 1);
      }
    });

    await chat.save();

    // Populate sender info
    await message.populate("sender", "fullname avatar");
    if (replyTo) {
      await message.populate("replyTo");
    }

    return message;
  }

  /**
   * Get messages for a chat
   * @param {String} chatId
   * @param {Object} options - { page, limit, before }
   */
  async getMessages(chatId, options = {}) {
    const { page = 1, limit = 50, before } = options;

    const query = {
      chat: chatId,
      isDeleted: false,
    };

    // Get messages before a certain message (for pagination)
    if (before) {
      const beforeMessage = await Message.findById(before);
      if (beforeMessage) {
        query.createdAt = { $lt: beforeMessage.createdAt };
      }
    }

    const result = await paginate(Message, query, {
      page,
      limit,
      sort: "-createdAt",
      populate: [
        { path: "sender", select: "fullname avatar" },
        { path: "replyTo", select: "content sender type" },
      ],
    });

    // Reverse order for chat (newest at bottom)
    result.data = result.data.reverse();

    return result;
  }

  /**
   * Edit message
   * @param {String} messageId
   * @param {String} userId
   * @param {String} newContent
   */
  async editMessage(messageId, userId, newContent) {
    const message = await Message.findById(messageId);

    if (!message) {
      throw new NotFoundError("Tin nhắn không tồn tại");
    }

    if (message.sender.toString() !== userId) {
      throw new ForbiddenError("Bạn không có quyền chỉnh sửa tin nhắn này");
    }

    await message.edit(newContent);
    return message;
  }

  /**
   * Delete message
   * @param {String} messageId
   * @param {String} userId
   * @param {Boolean} deleteForEveryone
   */
  async deleteMessage(messageId, userId, deleteForEveryone = false) {
    const message = await Message.findById(messageId);

    if (!message) {
      throw new NotFoundError("Tin nhắn không tồn tại");
    }

    if (message.sender.toString() !== userId && !deleteForEveryone) {
      throw new ForbiddenError("Bạn không có quyền xóa tin nhắn này");
    }

    if (deleteForEveryone && message.sender.toString() !== userId) {
      throw new ForbiddenError("Chỉ người gửi mới có thể xóa cho mọi người");
    }

    await message.softDelete(userId, deleteForEveryone);
    return { message: "Đã xóa tin nhắn" };
  }

  /**
   * Mark message as read
   * @param {String} messageId
   * @param {String} userId
   */
  async markAsRead(messageId, userId) {
    const message = await Message.findById(messageId);

    if (!message) {
      throw new NotFoundError("Tin nhắn không tồn tại");
    }

    await message.markAsRead(userId);

    // Reset unread count in chat
    const chat = await Chat.findById(message.chat);
    if (chat) {
      chat.unreadCount.set(userId.toString(), 0);
      await chat.save();
    }

    return { message: "Đã đánh dấu đã đọc" };
  }

  /**
   * Mark message as delivered
   * @param {String} messageId
   * @param {String} userId
   */
  async markAsDelivered(messageId, userId) {
    const message = await Message.findById(messageId);

    if (!message) {
      throw new NotFoundError("Tin nhắn không tồn tại");
    }

    await message.markAsDelivered(userId);
    return { message: "Đã đánh dấu đã nhận" };
  }
}

export default new MessageService();
