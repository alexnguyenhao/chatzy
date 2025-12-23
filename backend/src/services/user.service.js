import { User, FriendRequest } from "../models/index.js";
import { NotFoundError } from "../lib/errors.lib.js";
import { paginate } from "../lib/pagination.lib.js";

class UserService {
  /**
   * Get user by ID
   * @param {String} userId
   */
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Người dùng không tồn tại");
    }

    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  }

  /**
   * Get user profile (with additional info)
   * @param {String} userId
   */
  async getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Người dùng không tồn tại");
    }

    // Count friends
    const friendsCount = await FriendRequest.countDocuments({
      $or: [
        { sender: userId, status: "accepted" },
        { receiver: userId, status: "accepted" },
      ],
    });

    const userObject = user.toObject();
    delete userObject.password;

    return {
      ...userObject,
      friendsCount,
    };
  }

  /**
   * Update user profile
   * @param {String} userId
   * @param {Object} updateData - { fullname, bio, avatar, status }
   */
  async updateProfile(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Người dùng không tồn tại");
    }

    // Update allowed fields
    const allowedFields = ["fullname", "bio", "avatar", "status"];
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    await user.save();

    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  }

  /**
   * Search users
   * @param {String} query
   * @param {Object} options - { page, limit }
   */
  async searchUsers(query, options = {}) {
    const searchQuery = {
      $or: [
        { fullname: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    };

    const result = await paginate(User, searchQuery, {
      ...options,
      select: "-password",
    });

    return result;
  }

  /**
   * Get user's friends
   * @param {String} userId
   * @param {Object} options - { page, limit }
   */
  async getFriends(userId, options = {}) {
    const { page = 1, limit = 20 } = options;

    // Find accepted friend requests
    const friendRequests = await FriendRequest.find({
      $or: [
        { sender: userId, status: "accepted" },
        { receiver: userId, status: "accepted" },
      ],
    })
      .populate("sender", "fullname avatar status")
      .populate("receiver", "fullname avatar status")
      .skip((page - 1) * limit)
      .limit(limit);

    // Extract friend user objects
    const friends = friendRequests.map((req) => {
      return req.sender._id.toString() === userId ? req.receiver : req.sender;
    });

    const total = await FriendRequest.countDocuments({
      $or: [
        { sender: userId, status: "accepted" },
        { receiver: userId, status: "accepted" },
      ],
    });

    return {
      data: friends,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update user status
   * @param {String} userId
   * @param {String} status - online, offline, away, busy
   */
  async updateStatus(userId, status) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Người dùng không tồn tại");
    }

    user.status = status;
    user.lastSeen = new Date();
    await user.save();

    return { status: user.status, lastSeen: user.lastSeen };
  }

  /**
   * Update last seen
   * @param {String} userId
   */
  async updateLastSeen(userId) {
    await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
  }
}

export default new UserService();
