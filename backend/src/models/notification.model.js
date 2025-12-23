import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["message", "friend_request", "group_invite", "mention", "system"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: [100, "Tiêu đề không được vượt quá 100 ký tự"],
    },
    message: {
      type: String,
      required: true,
      maxlength: [500, "Nội dung không được vượt quá 500 ký tự"],
    },
    link: {
      type: String,
      default: "",
    },
    relatedChat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    relatedMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

// Method to mark as read
notificationSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
