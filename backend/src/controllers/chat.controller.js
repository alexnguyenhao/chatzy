import chatService from "../services/chat.service.js";
import { Chat } from "../models/index.js";
import { sendSuccess, asyncHandler } from "../utils/response.utils.js";
import { getPaginationParams } from "../lib/pagination.lib.js";

/**
 * Get all chats for user (excluding message requests)
 * GET /api/chats
 */
export const getChats = asyncHandler(async (req, res) => {
  const chats = await chatService.getChatsForUser(req.userId, {
    includeMessageRequests: false,
  });
  sendSuccess(res, 200, "Success", chats);
});

/**
 * Get message requests
 * GET /api/chats/requests
 */
export const getMessageRequests = asyncHandler(async (req, res) => {
  const requests = await chatService.getMessageRequests(req.userId);
  sendSuccess(res, 200, "Success", requests);
});

/**
 * Get chat by ID
 * GET /api/chats/:id
 */
export const getChatById = asyncHandler(async (req, res) => {
  const chat = await chatService.getChatById(req.params.id, req.userId);
  sendSuccess(res, 200, "Success", chat);
});

/**
 * Create new private chat
 * POST /api/chats
 */
export const createChat = asyncHandler(async (req, res) => {
  const { participants, name, type } = req.body;

  // For private chat
  if (!type || type === "private") {
    if (!participants || participants.length !== 1) {
      return sendSuccess(res, 400, "Private chat cần chính xác 1 người nhận");
    }

    const chat = await chatService.createOrGetPrivateChat(
      req.userId,
      participants[0]
    );
    sendSuccess(res, 201, "Tạo cuộc trò chuyện thành công", chat);
  } else {
    // Group chat
    const chat = await Chat.create({
      type: "group",
      name: name || "Nhóm chat",
      participants: [req.userId, ...participants],
      admin: req.userId,
    });
    sendSuccess(res, 201, "Tạo nhóm thành công", chat);
  }
});

/**
 * Update chat
 * PUT /api/chats/:id
 */
export const updateChat = asyncHandler(async (req, res) => {
  const chat = await chatService.updateChat(
    req.params.id,
    req.userId,
    req.body
  );
  sendSuccess(res, 200, "Cập nhật thành công", chat);
});

/**
 * Delete chat
 * DELETE /api/chats/:id
 */
export const deleteChat = asyncHandler(async (req, res) => {
  await chatService.deleteChat(req.params.id, req.userId);
  sendSuccess(res, 200, "Xóa cuộc trò chuyện thành công");
});

/**
 * Add participant to chat
 * POST /api/chats/:id/participants
 */
export const addParticipant = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const chat = await chatService.addParticipant(
    req.params.id,
    req.userId,
    userId
  );
  sendSuccess(res, 200, "Thêm thành viên thành công", chat);
});

/**
 * Remove participant from chat
 * DELETE /api/chats/:id/participants/:userId
 */
export const removeParticipant = asyncHandler(async (req, res) => {
  await chatService.removeParticipant(
    req.params.id,
    req.userId,
    req.params.userId
  );
  sendSuccess(res, 200, "Xóa thành viên thành công");
});

/**
 * Accept message request
 * POST /api/chats/:id/accept
 */
export const acceptMessageRequest = asyncHandler(async (req, res) => {
  const chat = await chatService.acceptMessageRequest(
    req.params.id,
    req.userId
  );
  sendSuccess(res, 200, "Đã chấp nhận message request", chat);
});

/**
 * Decline message request
 * POST /api/chats/:id/decline
 */
export const declineMessageRequest = asyncHandler(async (req, res) => {
  await chatService.declineMessageRequest(req.params.id, req.userId);
  sendSuccess(res, 200, "Đã từ chối message request");
});
