import Joi from "joi";

// Create comment validation
export const createCommentSchema = Joi.object({
  postId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Post ID không hợp lệ",
      "any.required": "Post ID là bắt buộc",
    }),
  content: Joi.string().max(1000).required().messages({
    "string.max": "Bình luận không được vượt quá 1000 ký tự",
    "any.required": "Nội dung bình luận là bắt buộc",
  }),
  parentComment: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Comment ID không hợp lệ",
    }),
  media: Joi.string().uri().allow("").optional(),
});

// Update comment validation
export const updateCommentSchema = Joi.object({
  content: Joi.string().max(1000).required().messages({
    "string.max": "Bình luận không được vượt quá 1000 ký tự",
    "any.required": "Nội dung bình luận là bắt buộc",
  }),
});

// Get comments validation (query params)
export const getCommentsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50),
  parentComment: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(),
});
