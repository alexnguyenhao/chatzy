import Joi from "joi";

// Register validation
export const registerSchema = Joi.object({
  fullname: Joi.string().min(2).max(100).trim().required().messages({
    "string.min": "Tên phải có ít nhất 2 ký tự",
    "string.max": "Tên không được vượt quá 100 ký tự",
    "any.required": "Tên đầy đủ là bắt buộc",
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
    "any.required": "Mật khẩu là bắt buộc",
  }),
  avatar: Joi.string().uri().allow("").optional(),
});

// Login validation
export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().required().messages({
    "any.required": "Mật khẩu là bắt buộc",
  }),
});

// Change password validation
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Mật khẩu hiện tại là bắt buộc",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "Mật khẩu mới phải có ít nhất 6 ký tự",
    "any.required": "Mật khẩu mới là bắt buộc",
  }),
});

// Reset password request
export const resetPasswordRequestSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
});

// Reset password
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "Mật khẩu mới phải có ít nhất 6 ký tự",
    "any.required": "Mật khẩu mới là bắt buộc",
  }),
});
