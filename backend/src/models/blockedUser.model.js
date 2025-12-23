import mongoose from "mongoose";

const blockedUserSchema = new mongoose.Schema(
  {
    blocker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blocked: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      maxlength: [500, "Lý do không được vượt quá 500 ký tự"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
blockedUserSchema.index({ blocker: 1, blocked: 1 }, { unique: true });
blockedUserSchema.index({ blocker: 1 });
blockedUserSchema.index({ blocked: 1 });

const BlockedUser = mongoose.model("BlockedUser", blockedUserSchema);

export default BlockedUser;
