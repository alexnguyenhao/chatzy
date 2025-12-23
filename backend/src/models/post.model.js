import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      maxlength: [10000, "Nội dung không được vượt quá 10000 ký tự"],
      trim: true,
    },
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video"],
        },
        url: String,
        publicId: String,
        thumbnail: String,
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },
    location: {
      type: String,
      default: "",
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    shareCount: {
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
    sharedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ visibility: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });

// Virtual for likes
postSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "post",
});

// Virtual for comments
postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

// Method to increment like count
postSchema.methods.incrementLikes = function () {
  this.likeCount++;
  return this.save();
};

// Method to decrement like count
postSchema.methods.decrementLikes = function () {
  this.likeCount = Math.max(0, this.likeCount - 1);
  return this.save();
};

// Method to increment comment count
postSchema.methods.incrementComments = function () {
  this.commentCount++;
  return this.save();
};

// Method to decrement comment count
postSchema.methods.decrementComments = function () {
  this.commentCount = Math.max(0, this.commentCount - 1);
  return this.save();
};

// Method to edit post
postSchema.methods.edit = function (newContent) {
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = new Date();
  return this.save();
};

const Post = mongoose.model("Post", postSchema);

export default Post;
