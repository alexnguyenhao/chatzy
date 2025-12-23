import Joi from "joi";

// Create post validation
export const createPostSchema = Joi.object({
  content: Joi.string().max(10000).allow("").messages({
    "string.max": "Nội dung không được vượt quá 10000 ký tự",
  }),
  visibility: Joi.string()
    .valid("public", "friends", "private")
    .default("public")
    .messages({
      "any.only": "Quyền riêng tư không hợp lệ",
    }),
  location: Joi.string().max(200).allow("").messages({
    "string.max": "Địa điểm không được vượt quá 200 ký tự",
  }),
  tags: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .max(20)
    .messages({
      "array.max": "Không được tag quá 20 người",
    }),
  sharedFrom: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Post ID không hợp lệ",
    }),
});

// Update post validation
export const updatePostSchema = Joi.object({
  content: Joi.string().max(10000).required().messages({
    "string.max": "Nội dung không được vượt quá 10000 ký tự",
    "any.required": "Nội dung là bắt buộc",
  }),
  visibility: Joi.string().valid("public", "friends", "private").messages({
    "any.only": "Quyền riêng tư không hợp lệ",
  }),
});

// Get posts validation (query params)
export const getPostsSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(),
  visibility: Joi.string().valid("public", "friends", "private").optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
});
