import messageService from "../services/message.service.js";
import { sendSuccess, asyncHandler } from "../utils/response.utils.js";
import { getPaginationParams } from "../lib/pagination.lib.js";

/**
 * Get messages for a chat
 * GET /api/messages/:chatId
 */
export const getMessages = asyncHandler(async (req, res) => {
  const { page, limit } = getPaginationParams(req);
  const messages = await messageService.getMessages(req.params.chatId, {
    page,
    limit,
  });
  sendSuccess(res, 200, "Success", messages);
});

/**
 * Send message
 * POST /api/messages
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const messageData = {
    ...req.body,
    senderId: req.userId,
  };

  const message = await messageService.sendMessage(messageData);
  sendSuccess(res, 201, "Gửi tin nhắn thành công", message);
});

/**
 * Edit message
 * PUT /api/messages/:id
 */
export const editMessage = asyncHandler(async (req, res) => {
  const message = await messageService.editMessage(
    req.params.id,
    req.userId,
    req.body.content
  );
  sendSuccess(res, 200, "Chỉnh sửa thành công", message);
});

/**
 * Delete message
 * DELETE /api/messages/:id
 */
export const deleteMessage = asyncHandler(async (req, res) => {
  const deleteForEveryone = req.query.forEveryone === "true";

  await messageService.deleteMessage(
    req.params.id,
    req.userId,
    deleteForEveryone
  );
  sendSuccess(res, 200, "Xóa tin nhắn thành công");
});

/**
 * Mark message as read
 * POST /api/messages/:id/read
 */
export const markAsRead = asyncHandler(async (req, res) => {
  await messageService.markAsRead(req.params.id, req.userId);
  sendSuccess(res, 200, "Đã đánh dấu đã đọc");
});

/**
 * Mark message as delivered
 * POST /api/messages/:id/delivered
 */
export const markAsDelivered = asyncHandler(async (req, res) => {
  await messageService.markAsDelivered(req.params.id, req.userId);
  sendSuccess(res, 200, "Đã đánh dấu đã nhận");
});
