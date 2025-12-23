import Joi from "joi";

// Create/toggle like validation
export const toggleLikeSchema = Joi.object({
  targetType: Joi.string().valid("Post", "Comment").required().messages({
    "any.only": "Loại target không hợp lệ",
    "any.required": "Loại target là bắt buộc",
  }),
  targetId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Target ID không hợp lệ",
      "any.required": "Target ID là bắt buộc",
    }),
  reactionType: Joi.string()
    .valid("like", "love", "haha", "wow", "sad", "angry")
    .default("like")
    .messages({
      "any.only": "Loại reaction không hợp lệ",
    }),
});
