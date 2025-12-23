import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
    },
    message: {
      type: String,
      maxlength: [200, "Tin nhắn không được vượt quá 200 ký tự"],
      default: "",
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
friendRequestSchema.index({ receiver: 1, status: 1 });
friendRequestSchema.index({ createdAt: -1 });

// Prevent duplicate friend requests with unique compound index
friendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

// Method to accept friend request
friendRequestSchema.methods.accept = function () {
  this.status = "accepted";
  this.respondedAt = new Date();
  return this.save();
};

// Method to reject friend request
friendRequestSchema.methods.reject = function () {
  this.status = "rejected";
  this.respondedAt = new Date();
  return this.save();
};

// Method to cancel friend request
friendRequestSchema.methods.cancel = function () {
  this.status = "cancelled";
  return this.save();
};

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;
