import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: [true, "Chat ID là bắt buộc"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender ID là bắt buộc"],
    },
    type: {
      type: String,
      enum: ["text", "image", "file", "video", "audio"],
      default: "text",
      required: true,
    },
    content: {
      type: String,
      required: function () {
        return this.type === "text";
      },
      maxlength: [5000, "Nội dung tin nhắn không được vượt quá 5000 ký tự"],
    },
    media: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
      fileName: {
        type: String,
      },
      fileSize: {
        type: Number,
      },
      mimeType: {
        type: String,
      },
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    deliveredTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
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
    deletedAt: {
      type: Date,
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ chat: 1, isDeleted: 1 });

// Method to mark as read
messageSchema.methods.markAsRead = function (userId) {
  const alreadyRead = this.readBy.some(
    (r) => r.user.toString() === userId.toString()
  );

  if (!alreadyRead) {
    this.readBy.push({ user: userId, readAt: new Date() });
  }

  return this.save();
};

// Method to mark as delivered
messageSchema.methods.markAsDelivered = function (userId) {
  if (!this.deliveredTo.includes(userId)) {
    this.deliveredTo.push(userId);
  }

  return this.save();
};

// Method to soft delete message
messageSchema.methods.softDelete = function (userId = null) {
  if (userId) {
    // Delete for specific user
    if (!this.deletedFor.includes(userId)) {
      this.deletedFor.push(userId);
    }
  } else {
    // Delete for everyone
    this.isDeleted = true;
    this.deletedAt = new Date();
  }

  return this.save();
};

// Method to edit message
messageSchema.methods.edit = function (newContent) {
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = new Date();

  return this.save();
};

const Message = mongoose.model("Message", messageSchema);

export default Message;
