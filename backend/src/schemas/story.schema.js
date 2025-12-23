import Joi from "joi";

// Create story validation
export const createStorySchema = Joi.object({
  type: Joi.string().valid("image", "video", "text").required().messages({
    "any.only": "Loại story không hợp lệ",
    "any.required": "Loại story là bắt buộc",
  }),
  content: Joi.string()
    .max(500)
    .when("type", {
      is: "text",
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "string.max": "Nội dung không được vượt quá 500 ký tự",
      "any.required": "Nội dung là bắt buộc cho text story",
    }),
  backgroundColor: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .default("#000000")
    .messages({
      "string.pattern.base": "Màu nền không hợp lệ (phải là hex color)",
    }),
  duration: Joi.number().integer().min(1).max(48).default(24).messages({
    "number.min": "Thời gian phải ít nhất 1 giờ",
    "number.max": "Thời gian không được vượt quá 48 giờ",
  }),
  visibility: Joi.string()
    .valid("public", "friends", "close_friends")
    .default("friends")
    .messages({
      "any.only": "Quyền riêng tư không hợp lệ",
    }),
});

// Get stories validation (query params)
export const getStoriesSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
});
