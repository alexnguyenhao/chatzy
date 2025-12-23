import { Notification } from "../models/index.js";

class NotificationService {
  /**
   * Create notification
   * @param {Object} data - { recipient, sender, type, title, message, link, relatedChat, relatedMessage }
   */
  async createNotification(data) {
    const notification = await Notification.create(data);
    await notification.populate("sender", "fullname avatar");
    return notification;
  }

  /**
   * Create message notification
   * @param {String} recipientId
   * @param {String} senderId
   * @param {String} chatId
   * @param {String} messageId
   */
  async createMessageNotification(recipientId, senderId, chatId, messageId) {
    return this.createNotification({
      recipient: recipientId,
      sender: senderId,
      type: "message",
      title: "Tin nhắn mới",
      message: "Bạn có một tin nhắn mới",
      relatedChat: chatId,
      relatedMessage: messageId,
    });
  }

  /**
   * Create friend request notification
   * @param {String} recipientId
   * @param {String} senderId
   */
  async createFriendRequestNotification(recipientId, senderId) {
    return this.createNotification({
      recipient: recipientId,
      sender: senderId,
      type: "friend_request",
      title: "Lời mời kết bạn",
      message: "Bạn có một lời mời kết bạn mới",
    });
  }

  /**
   * Get notifications for user
   * @param {String} userId
   * @param {Object} options - { page, limit, isRead }
   */
  async getNotifications(userId, options = {}) {
    const { page = 1, limit = 20, isRead } = options;

    const query = { recipient: userId };
    if (isRead !== undefined) {
      query.isRead = isRead;
    }

    const notifications = await Notification.find(query)
      .populate("sender", "fullname avatar")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    return {
      data: notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Mark notification as read
   * @param {String} notificationId
   * @param {String} userId
   */
  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });

    if (notification && !notification.isRead) {
      await notification.markAsRead();
    }

    return notification;
  }

  /**
   * Mark all notifications as read
   * @param {String} userId
   */
  async markAllAsRead(userId) {
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return { message: "Đã đánh dấu tất cả đã đọc" };
  }

  /**
   * Delete notification
   * @param {String} notificationId
   * @param {String} userId
   */
  async deleteNotification(notificationId, userId) {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      throw new NotFoundError("Thông báo không tồn tại");
    }

    return { message: "Đã xóa thông báo" };
  }
}

export default new NotificationService();
