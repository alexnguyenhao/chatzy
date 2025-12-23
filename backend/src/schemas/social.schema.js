import Joi from "joi";

// Send friend request validation
export const sendFriendRequestSchema = Joi.object({
  receiverId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "User ID không hợp lệ",
      "any.required": "User ID là bắt buộc",
    }),
  message: Joi.string().max(200).allow("").messages({
    "string.max": "Tin nhắn không được vượt quá 200 ký tự",
  }),
});

// Block user validation
export const blockUserSchema = Joi.object({
  blockedId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "User ID không hợp lệ",
      "any.required": "User ID là bắt buộc",
    }),
  reason: Joi.string().max(500).allow("").messages({
    "string.max": "Lý do không được vượt quá 500 ký tự",
  }),
});
