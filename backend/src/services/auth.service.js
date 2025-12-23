import { User } from "../models/index.js";
import { hashPassword, comparePassword } from "../lib/password.lib.js";
import { generateToken } from "../utils/jwt.utils.js";
import {
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  ValidationError,
} from "../lib/errors.lib.js";

class AuthService {
  /**
   * Register new user
   * @param {Object} userData - { fullname, email, password, avatar }
   */
  async register(userData) {
    const { fullname, email, password, avatar } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("Email đã được sử dụng");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      avatar: avatar || "",
    });

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    // Send welcome email (async, don't wait)
    console.log("📧 Attempting to send welcome email to:", user.email);
    const emailService = (await import("./email.service.js")).default;
    emailService
      .sendWelcomeEmail(user.email, user.fullname)
      .then(() => {
        console.log("✅ Welcome email sent successfully to:", user.email);
      })
      .catch((err) => {
        console.error("❌ Failed to send welcome email:", err.message);
        console.error("Error details:", err);
      });

    // Return user without password
    const userObject = user.toObject();
    delete userObject.password;

    return {
      user: userObject,
      token,
    };
  }

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   */
  async login(credentials) {
    const { email, password } = credentials;

    // Find user with password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new UnauthorizedError("Email hoặc mật khẩu không đúng");
    }

    // Check password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Email hoặc mật khẩu không đúng");
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    // Update status to online (after successful token generation)
    user.status = "online";
    user.lastSeen = new Date();
    await user.save();

    const userObject = user.toObject();
    delete userObject.password;

    return {
      user: userObject,
      token,
    };
  }

  /**
   * Logout user
   * @param {String} userId
   */
  async logout(userId) {
    // Update status to offline
    const user = await User.findById(userId);
    if (user) {
      user.status = "offline";
      user.lastSeen = new Date();
      await user.save();
    }

    return { message: "Đăng xuất thành công" };
  }

  /**
   * Get current user
   * @param {String} userId
   */
  async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Người dùng không tồn tại");
    }

    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
  }

  /**
   * Change password
   * @param {String} userId
   * @param {Object} passwords - { currentPassword, newPassword }
   */
  async changePassword(userId, passwords) {
    const { currentPassword, newPassword } = passwords;

    // Find user with password
    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw new NotFoundError("Người dùng không tồn tại");
    }

    // Verify current password
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Mật khẩu hiện tại không đúng");
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    return { message: "Đổi mật khẩu thành công" };
  }

  /**
   * Request password reset (send email with token)
   * @param {String} email
   */
  async resetPasswordRequest(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists (security)
      return { message: "Nếu email tồn tại, link reset đã được gửi" };
    }

    // Generate secure reset token
    const crypto = await import("crypto");
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save hashed token to user with 1 hour expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email with plain token (not hashed)
    const emailService = (await import("./email.service.js")).default;
    await emailService
      .sendPasswordResetEmail(user.email, user.fullname, resetToken)
      .catch((err) => console.error("Failed to send reset email:", err));

    return { message: "Nếu email tồn tại, link reset đã được gửi" };
  }

  /**
   * Reset password with token
   * @param {String} token - Plain reset token from email
   * @param {String} newPassword
   */
  async resetPassword(token, newPassword) {
    // Hash the token to compare with database
    const crypto = await import("crypto");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user by token and check expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new UnauthorizedError("Token không hợp lệ hoặc đã hết hạn");
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return { message: "Đặt lại mật khẩu thành công" };
  }

  /**
   * Verify email with verification code
   * @param {String} email
   * @param {String} code - 6-digit verification code
   */
  async verifyEmail(email, code) {
    // Find user by email and verification code
    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new UnauthorizedError("Mã xác nhận không hợp lệ hoặc đã hết hạn");
    }

    // Update user as verified
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    return { message: "Xác nhận email thành công" };
  }

  /**
   * Send verification code
   * @param {String} userId
   */
  async sendVerificationCode(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Người dùng không tồn tại");
    }

    if (user.isVerified) {
      return { message: "Email đã được xác nhận" };
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save code with 15 min expiry
    user.verificationCode = code;
    user.verificationCodeExpires = Date.now() + 900000; // 15 minutes
    await user.save();

    // Send email
    const emailService = (await import("./email.service.js")).default;
    await emailService
      .sendVerificationEmail(user.email, user.fullname, code)
      .catch((err) => console.error("Failed to send verification email:", err));

    return { message: "Mã xác nhận đã được gửi đến email của bạn" };
  }

  /**
   * Refresh JWT token
   * @param {String} userId
   */
  async refreshToken(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Người dùng không tồn tại");
    }

    // Generate new token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return { token };
  }
}

export default new AuthService();
