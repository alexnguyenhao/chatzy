import { sendEmail } from "../config/sendgrid.js";
import {
  getWelcomeEmailTemplate,
  getVerifyEmailTemplate,
  getResetPasswordTemplate,
  getFriendRequestTemplate,
  getNewMessageTemplate,
} from "../utils/emailTemplates.utils.js";
import logger from "../lib/logger.lib.js";

class EmailService {
  /**
   * Send welcome email to new user
   * @param {String} email
   * @param {String} name
   */
  async sendWelcomeEmail(email, name) {
    try {
      await sendEmail({
        to: email,
        subject: `Chào mừng đến với Chatzy, ${name}! 🎉`,
        html: getWelcomeEmailTemplate(name),
        text: `Chào mừng ${name} đến với Chatzy! Bắt đầu chat với bạn bè ngay hôm nay.`,
      });
      logger.success(`Welcome email sent to ${email}`);
    } catch (error) {
      logger.error(`Failed to send welcome email to ${email}:`, error);
    }
  }

  /**
   * Send email verification code
   * @param {String} email
   * @param {String} name
   * @param {String} verificationCode - 6-digit code
   */
  async sendVerificationEmail(email, name, verificationCode) {
    try {
      await sendEmail({
        to: email,
        subject: "Xác nhận email của bạn - Chatzy",
        html: getVerifyEmailTemplate(name, verificationCode),
        text: `Mã xác nhận của bạn là: ${verificationCode}. Mã này sẽ hết hạn sau 15 phút.`,
      });
      logger.success(`Verification email sent to ${email}`);
    } catch (error) {
      logger.error(`Failed to send verification email to ${email}:`, error);
    }
  }

  /**
   * Send password reset email
   * @param {String} email
   * @param {String} name
   * @param {String} resetToken - Reset token
   */
  async sendPasswordResetEmail(email, name, resetToken) {
    try {
      const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

      await sendEmail({
        to: email,
        subject: "Đặt lại mật khẩu - Chatzy",
        html: getResetPasswordTemplate(name, resetLink),
        text: `Nhấp vào link sau để đặt lại mật khẩu: ${resetLink}. Link này sẽ hết hạn sau 1 giờ.`,
      });
      logger.success(`Password reset email sent to ${email}`);
    } catch (error) {
      logger.error(`Failed to send password reset email to ${email}:`, error);
    }
  }

  /**
   * Send friend request notification
   * @param {String} recipientEmail
   * @param {String} recipientName
   * @param {String} senderName
   */
  async sendFriendRequestEmail(recipientEmail, recipientName, senderName) {
    try {
      await sendEmail({
        to: recipientEmail,
        subject: `${senderName} đã gửi lời mời kết bạn - Chatzy`,
        html: getFriendRequestTemplate(recipientName, senderName),
        text: `${senderName} đã gửi lời mời kết bạn cho bạn trên Chatzy. Đăng nhập để xem lời mời.`,
      });
      logger.success(`Friend request email sent to ${recipientEmail}`);
    } catch (error) {
      logger.error(
        `Failed to send friend request email to ${recipientEmail}:`,
        error
      );
    }
  }

  /**
   * Send new message notification
   * @param {String} recipientEmail
   * @param {String} recipientName
   * @param {String} senderName
   * @param {String} messagePreview - First 100 chars
   */
  async sendNewMessageEmail(
    recipientEmail,
    recipientName,
    senderName,
    messagePreview
  ) {
    try {
      // Truncate preview to 100 chars
      const preview =
        messagePreview.length > 100
          ? messagePreview.substring(0, 100) + "..."
          : messagePreview;

      await sendEmail({
        to: recipientEmail,
        subject: `Tin nhắn mới từ ${senderName} - Chatzy`,
        html: getNewMessageTemplate(recipientName, senderName, preview),
        text: `Bạn có tin nhắn mới từ ${senderName}: "${preview}"`,
      });
      logger.success(`New message email sent to ${recipientEmail}`);
    } catch (error) {
      logger.error(
        `Failed to send new message email to ${recipientEmail}:`,
        error
      );
    }
  }

  /**
   * Send generic notification email
   * @param {String} email
   * @param {String} subject
   * @param {String} message
   */
  async sendNotificationEmail(email, subject, message) {
    try {
      await sendEmail({
        to: email,
        subject: `${subject} - Chatzy`,
        text: message,
        html: `<p>${message}</p>`, // Simple HTML
      });
      logger.success(`Notification email sent to ${email}`);
    } catch (error) {
      logger.error(`Failed to send notification email to ${email}:`, error);
    }
  }
}

export default new EmailService();
