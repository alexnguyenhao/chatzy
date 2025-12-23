import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Nội dung bình luận là bắt buộc"],
      maxlength: [1000, "Bình luận không được vượt quá 1000 ký tự"],
      trim: true,
    },
    media: {
      type: String, // URL for image/gif
      default: "",
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null, // For nested replies
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    replyCount: {
      type: Number,
      default: 0,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });

// Virtual for replies
commentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentComment",
});

// Method to increment like count
commentSchema.methods.incrementLikes = function () {
  this.likeCount++;
  return this.save();
};

// Method to decrement like count
commentSchema.methods.decrementLikes = function () {
  this.likeCount = Math.max(0, this.likeCount - 1);
  return this.save();
};

// Method to increment reply count
commentSchema.methods.incrementReplies = function () {
  this.replyCount++;
  return this.save();
};

// Method to edit comment
commentSchema.methods.edit = function (newContent) {
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = new Date();
  return this.save();
};

// Method to soft delete
commentSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.content = "[Bình luận đã bị xóa]";
  return this.save();
};

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
