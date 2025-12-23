import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "video", "text"],
      required: true,
    },
    media: {
      url: String,
      publicId: String,
      thumbnail: String,
    },
    content: {
      type: String,
      maxlength: [500, "Nội dung không được vượt quá 500 ký tự"],
    },
    backgroundColor: {
      type: String,
      default: "#000000", // For text stories
    },
    duration: {
      type: Number,
      default: 24, // hours
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    viewers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "friends", "close_friends"],
      default: "friends",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
storySchema.index({ author: 1, expiresAt: 1 });
storySchema.index({ expiresAt: 1 }); // For auto-cleanup
storySchema.index({ isActive: 1, expiresAt: 1 });

// Auto-set expiration time
storySchema.pre("save", function (next) {
  if (this.isNew && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + this.duration * 60 * 60 * 1000);
  }
  next();
});

// Method to add viewer
storySchema.methods.addViewer = function (userId) {
  const alreadyViewed = this.viewers.some(
    (v) => v.user.toString() === userId.toString()
  );

  if (!alreadyViewed) {
    this.viewers.push({ user: userId, viewedAt: new Date() });
    this.viewCount++;
  }

  return this.save();
};

// Method to check if expired
storySchema.methods.isExpired = function () {
  return new Date() > this.expiresAt;
};

// Static method to clean up expired stories
storySchema.statics.cleanupExpired = async function () {
  return this.updateMany(
    { expiresAt: { $lt: new Date() }, isActive: true },
    { isActive: false }
  );
};

const Story = mongoose.model("Story", storySchema);

export default Story;
