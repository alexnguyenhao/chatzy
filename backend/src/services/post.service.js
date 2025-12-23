import { Post, Comment, Like, User } from "../models/index.js";
import { NotFoundError, ForbiddenError } from "../lib/errors.lib.js";
import { paginate } from "../lib/pagination.lib.js";

class PostService {
  /**
   * Create a new post
   * @param {Object} data - { authorId, content, media, visibility, tags, location }
   */
  async createPost(data) {
    const { authorId, content, media, visibility, tags, location } = data;

    const post = await Post.create({
      author: authorId,
      content,
      media: media || [],
      visibility: visibility || "public",
      tags: tags || [],
      location: location || "",
    });

    await post.populate("author", "fullname avatar");
    return post;
  }

  /**
   * Get news feed
   * @param {String} userId
   * @param {Object} options - { page, limit }
   */
  async getFeed(userId, options = {}) {
    // Get user's friends
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Người dùng không tồn tại");
    }

    // For now, show public posts and posts from friends
    // TODO: Get friend IDs from FriendRequest model
    const query = {
      $or: [
        { visibility: "public" },
        { author: userId }, // User's own posts
        // Add friends' posts logic here
      ],
    };

    const result = await paginate(Post, query, {
      ...options,
      sort: "-createdAt",
      populate: [
        { path: "author", select: "fullname avatar" },
        { path: "tags", select: "fullname avatar" },
      ],
    });

    return result;
  }

  /**
   * Get post by ID
   * @param {String} postId
   * @param {String} userId - For privacy check
   */
  async getPostById(postId, userId) {
    const post = await Post.findById(postId)
      .populate("author", "fullname avatar")
      .populate("tags", "fullname avatar");

    if (!post) {
      throw new NotFoundError("Bài viết không tồn tại");
    }

    // Check visibility permissions
    if (
      post.visibility === "private" &&
      post.author._id.toString() !== userId
    ) {
      throw new ForbiddenError("Bạn không có quyền xem bài viết này");
    }

    return post;
  }

  /**
   * Get user's posts
   * @param {String} userId
   * @param {Object} options - { page, limit, visibility }
   */
  async getUserPosts(userId, options = {}) {
    const { visibility, ...paginationOptions } = options;

    const query = { author: userId };
    if (visibility) {
      query.visibility = visibility;
    }

    const result = await paginate(Post, query, {
      ...paginationOptions,
      sort: "-createdAt",
      populate: { path: "author", select: "fullname avatar" },
    });

    return result;
  }

  /**
   * Update post
   * @param {String} postId
   * @param {String} userId
   * @param {Object} updateData - { content, visibility }
   */
  async updatePost(postId, userId, updateData) {
    const post = await Post.findById(postId);

    if (!post) {
      throw new NotFoundError("Bài viết không tồn tại");
    }

    if (post.author.toString() !== userId) {
      throw new ForbiddenError("Bạn không có quyền chỉnh sửa bài viết này");
    }

    if (updateData.content) {
      await post.edit(updateData.content);
    }

    if (updateData.visibility) {
      post.visibility = updateData.visibility;
      await post.save();
    }

    return post;
  }

  /**
   * Delete post
   * @param {String} postId
   * @param {String} userId
   */
  async deletePost(postId, userId) {
    const post = await Post.findById(postId);

    if (!post) {
      throw new NotFoundError("Bài viết không tồn tại");
    }

    if (post.author.toString() !== userId) {
      throw new ForbiddenError("Bạn không có quyền xóa bài viết này");
    }

    // Delete related comments and likes
    await Comment.deleteMany({ post: postId });
    await Like.deleteMany({ post: postId });
    await post.deleteOne();

    return { message: "Đã xóa bài viết" };
  }

  /**
   * Share post
   * @param {String} postId
   * @param {String} userId
   * @param {String} content - Optional share message
   */
  async sharePost(postId, userId, content) {
    const originalPost = await Post.findById(postId);

    if (!originalPost) {
      throw new NotFoundError("Bài viết không tồn tại");
    }

    // Create new post with sharedFrom reference
    const sharedPost = await Post.create({
      author: userId,
      content: content || "",
      sharedFrom: postId,
      visibility: "public",
    });

    // Increment share count on original post
    originalPost.shareCount++;
    await originalPost.save();

    await sharedPost.populate("author", "fullname avatar");
    await sharedPost.populate("sharedFrom");

    return sharedPost;
  }

  /**
   * Get post comments
   * @param {String} postId
   * @param {Object} options - { page, limit }
   */
  async getComments(postId, options = {}) {
    const query = {
      post: postId,
      parentComment: null, // Only top-level comments
      isDeleted: false,
    };

    const result = await paginate(Comment, query, {
      ...options,
      sort: "-createdAt",
      populate: { path: "author", select: "fullname avatar" },
    });

    return result;
  }

  /**
   * Get post likes
   * @param {String} postId
   * @param {Object} options - { page, limit, reactionType }
   */
  async getLikes(postId, options = {}) {
    const { reactionType, ...paginationOptions } = options;

    const query = { post: postId };
    if (reactionType) {
      query.reactionType = reactionType;
    }

    const result = await paginate(Like, query, {
      ...paginationOptions,
      populate: { path: "user", select: "fullname avatar" },
    });

    return result;
  }
}

export default new PostService();
