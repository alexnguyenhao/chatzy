import Joi from "joi";

// Create chat validation
export const createChatSchema = Joi.object({
  type: Joi.string().valid("private", "group").required().messages({
    "any.only": "Loại chat không hợp lệ",
    "any.required": "Loại chat là bắt buộc",
  }),
  participants: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .min(1)
    .required()
    .messages({
      "array.min": "Phải có ít nhất 1 người tham gia",
      "any.required": "Danh sách người tham gia là bắt buộc",
    }),
  name: Joi.string()
    .max(100)
    .when("type", {
      is: "group",
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "string.max": "Tên nhóm không được vượt quá 100 ký tự",
      "any.required": "Tên nhóm là bắt buộc",
    }),
  description: Joi.string().max(500).allow("").messages({
    "string.max": "Mô tả không được vượt quá 500 ký tự",
  }),
});

// Add participant validation
export const addParticipantSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "User ID không hợp lệ",
      "any.required": "User ID là bắt buộc",
    }),
});

// Update chat validation
export const updateChatSchema = Joi.object({
  name: Joi.string().max(100).messages({
    "string.max": "Tên nhóm không được vượt quá 100 ký tự",
  }),
  description: Joi.string().max(500).allow("").messages({
    "string.max": "Mô tả không được vượt quá 500 ký tự",
  }),
  avatar: Joi.string().uri().allow(""),
});
