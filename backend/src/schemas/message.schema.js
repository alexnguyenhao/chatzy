import Joi from "joi";

// Send message validation
export const sendMessageSchema = Joi.object({
  chatId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Chat ID không hợp lệ",
      "any.required": "Chat ID là bắt buộc",
    }),
  type: Joi.string()
    .valid("text", "image", "file", "video", "audio")
    .required()
    .messages({
      "any.only": "Loại tin nhắn không hợp lệ",
      "any.required": "Loại tin nhắn là bắt buộc",
    }),
  content: Joi.string()
    .max(5000)
    .when("type", {
      is: "text",
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "string.max": "Nội dung không được vượt quá 5000 ký tự",
      "any.required": "Nội dung tin nhắn là bắt buộc",
    }),
  replyTo: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Message ID không hợp lệ",
    }),
});

// Edit message validation
export const editMessageSchema = Joi.object({
  content: Joi.string().max(5000).required().messages({
    "string.max": "Nội dung không được vượt quá 5000 ký tự",
    "any.required": "Nội dung tin nhắn là bắt buộc",
  }),
});

// Get messages validation (query params)
export const getMessagesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50),
  before: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(),
});
