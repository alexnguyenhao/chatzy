import Joi from "joi";

// Update profile validation
export const updateProfileSchema = Joi.object({
  fullname: Joi.string().min(2).max(100).trim().messages({
    "string.min": "Tên phải có ít nhất 2 ký tự",
    "string.max": "Tên không được vượt quá 100 ký tự",
  }),
  bio: Joi.string().max(500).allow("").messages({
    "string.max": "Bio không được vượt quá 500 ký tự",
  }),
  avatar: Joi.string().uri().allow(""),
  status: Joi.string().valid("online", "offline", "away", "busy").messages({
    "any.only": "Trạng thái không hợp lệ",
  }),
});

// Search users validation
export const searchUsersSchema = Joi.object({
  query: Joi.string().min(1).trim().required().messages({
    "string.min": "Từ khóa tìm kiếm phải có ít nhất 1 ký tự",
    "any.required": "Từ khóa tìm kiếm là bắt buộc",
  }),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
});
