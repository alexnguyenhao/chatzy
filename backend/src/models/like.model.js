import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["Post", "Comment"],
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    reactionType: {
      type: String,
      enum: ["like", "love", "haha", "wow", "sad", "angry"],
      default: "like",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
likeSchema.index({ user: 1, post: 1 }, { unique: true, sparse: true });
likeSchema.index({ user: 1, comment: 1 }, { unique: true, sparse: true });
likeSchema.index({ post: 1 });
likeSchema.index({ comment: 1 });

// Validate that either post or comment is set
likeSchema.pre("save", function (next) {
  if (this.targetType === "Post" && !this.post) {
    next(new Error("Post ID is required for Post likes"));
  } else if (this.targetType === "Comment" && !this.comment) {
    next(new Error("Comment ID is required for Comment likes"));
  } else {
    next();
  }
});

const Like = mongoose.model("Like", likeSchema);

export default Like;
