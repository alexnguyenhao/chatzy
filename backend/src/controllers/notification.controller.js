import { sendSuccess, asyncHandler } from "../utils/response.utils.js";
import { Notification } from "../models/index.js";
import { getPaginationParams } from "../lib/pagination.lib.js";

/**
 * Get notifications for user
 * GET /api/notifications
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const { page, limit } = getPaginationParams(req);

  const notifications = await Notification.find({ recipient: req.userId })
    .populate("sender", "fullname avatar")
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit);

  const unreadCount = await Notification.countDocuments({
    recipient: req.userId,
    isRead: false,
  });

  sendSuccess(res, 200, "Success", { notifications, unreadCount });
});

/**
 * Mark notification as read
 * PUT /api/notifications/:id/read
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification && notification.recipient.toString() === req.userId) {
    await notification.markAsRead();
  }

  sendSuccess(res, 200, "Đã đánh dấu đã đọc");
});

/**
 * Mark all notifications as read
 * PUT /api/notifications/read-all
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  sendSuccess(res, 200, "Đã đánh dấu tất cả đã đọc");
});

/**
 * Delete notification
 * DELETE /api/notifications/:id
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.userId,
  });

  sendSuccess(res, 200, "Xóa thông báo thành công");
});
