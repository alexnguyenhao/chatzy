import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [100, "Tên cuộc trò chuyện không được vượt quá 100 ký tự"],
    },
    type: {
      type: String,
      enum: ["private", "group"],
      default: "private",
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Only for group chats
    },
    avatar: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      maxlength: [500, "Mô tả không được vượt quá 500 ký tự"],
      default: "",
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
      // Format: { userId: unreadCount }
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isMessageRequest: {
      type: Boolean,
      default: false,
      // true if chat is from non-friend (pending acceptance)
    },
    messageRequestAcceptedAt: {
      type: Date,
      // When the message request was accepted
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
chatSchema.index({ participants: 1 });
chatSchema.index({ lastMessageAt: -1 });
chatSchema.index({ type: 1 });

// Validate participants
chatSchema.pre("save", function (next) {
  if (this.type === "private" && this.participants.length !== 2) {
    next(new Error("Private chat must have exactly 2 participants"));
  } else if (this.type === "group" && this.participants.length < 2) {
    next(new Error("Group chat must have at least 2 participants"));
  } else {
    next();
  }
});

// Method to add participant
chatSchema.methods.addParticipant = function (userId) {
  if (!this.participants.includes(userId)) {
    this.participants.push(userId);
    this.unreadCount.set(userId.toString(), 0);
  }
  return this.save();
};

// Method to remove participant
chatSchema.methods.removeParticipant = function (userId) {
  this.participants = this.participants.filter(
    (p) => p.toString() !== userId.toString()
  );
  this.unreadCount.delete(userId.toString());
  return this.save();
};

// Method to increment unread count
chatSchema.methods.incrementUnread = function (userId) {
  const currentCount = this.unreadCount.get(userId.toString()) || 0;
  this.unreadCount.set(userId.toString(), currentCount + 1);
  return this.save();
};

// Method to reset unread count
chatSchema.methods.resetUnread = function (userId) {
  this.unreadCount.set(userId.toString(), 0);
  return this.save();
};

// Method to accept message request
chatSchema.methods.acceptMessageRequest = function () {
  this.isMessageRequest = false;
  this.messageRequestAcceptedAt = new Date();
  return this.save();
};

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
