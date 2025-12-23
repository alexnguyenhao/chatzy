/**
 * Get base email template with Chatzy branding
 * Instagram-inspired color scheme
 */
export const getBaseTemplate = (content) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chatzy</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #F9FAFB;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #F77737 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #FFFFFF;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px 30px;
      color: #111827;
    }
    h1 {
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 20px;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
      color: #6B7280;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #833AB4 0%, #FD1D1D 100%);
      color: #FFFFFF;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      transition: transform 0.2s;
    }
    .button:hover {
      transform: translateY(-2px);
    }
    .divider {
      height: 1px;
      background-color: #E5E7EB;
      margin: 30px 0;
    }
    .footer {
      padding: 30px;
      text-align: center;
      background-color: #F9FAFB;
      border-top: 1px solid #E5E7EB;
    }
    .footer-text {
      font-size: 14px;
      color: #6B7280;
      margin-bottom: 10px;
    }
    .social-links {
      margin-top: 20px;
    }
    .social-links a {
      display: inline-block;
      margin: 0 10px;
      color: #833AB4;
      text-decoration: none;
      font-size: 14px;
    }
    .highlight {
      background: linear-gradient(135deg, #833AB4 0%, #FD1D1D 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 600;
    }
    .code-box {
      background-color: #F9FAFB;
      border: 2px solid #E5E7EB;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    }
    .code {
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 4px;
      background: linear-gradient(135deg, #833AB4 0%, #FD1D1D 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Chatzy</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p class="footer-text">© 2024 Chatzy. All rights reserved.</p>
      <p class="footer-text">Connect, share, and chat with friends.</p>
      <div class="social-links">
        <a href="#">About</a> · 
        <a href="#">Help Center</a> · 
        <a href="#">Privacy Policy</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Welcome Email Template
 */
export const getWelcomeEmailTemplate = (name) => {
  const content = `
    <h1>Chào mừng đến với <span class="highlight">Chatzy</span>! 🎉</h1>
    <p>Xin chào <strong>${name}</strong>,</p>
    <p>Chúng tôi rất vui khi bạn đã tham gia cộng đồng Chatzy! Bây giờ bạn có thể:</p>
    <ul style="color: #6B7280; line-height: 1.8; margin: 20px 0; padding-left: 20px;">
      <li>💬 Chat với bạn bè trong thời gian thực</li>
      <li>📸 Chia sẻ ảnh, video và moments</li>
      <li>👥 Kết nối với những người mới</li>
      <li>📱 Sử dụng trên mọi thiết bị</li>
    </ul>
    <center>
      <a href="${process.env.CLIENT_URL}" class="button">Bắt Đầu Chat Ngay</a>
    </center>
    <div class="divider"></div>
    <p style="font-size: 14px;">Nếu bạn cần hỗ trợ, đội ngũ của chúng tôi luôn sẵn sàng giúp đỡ!</p>
  `;
  return getBaseTemplate(content);
};

/**
 * Verify Email Template
 */
export const getVerifyEmailTemplate = (name, verificationCode) => {
  const content = `
    <h1>Xác Nhận Email Của Bạn</h1>
    <p>Xin chào <strong>${name}</strong>,</p>
    <p>Cảm ơn bạn đã đăng ký Chatzy! Vui lòng sử dụng mã xác nhận bên dưới để hoàn tất đăng ký:</p>
    <div class="code-box">
      <div class="code">${verificationCode}</div>
    </div>
    <p style="text-align: center; font-size: 14px; color: #6B7280;">Mã này sẽ hết hạn sau <strong>15 phút</strong></p>
    <div class="divider"></div>
    <p style="font-size: 14px; color: #6B7280;">
      Nếu bạn không yêu cầu xác nhận này, vui lòng bỏ qua email này.
    </p>
  `;
  return getBaseTemplate(content);
};

/**
 * Reset Password Email Template
 */
export const getResetPasswordTemplate = (name, resetLink) => {
  const content = `
    <h1>Đặt Lại Mật Khẩu</h1>
    <p>Xin chào <strong>${name}</strong>,</p>
    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản Chatzy của bạn.</p>
    <p>Nhấp vào nút bên dưới để tạo mật khẩu mới:</p>
    <center>
      <a href="${resetLink}" class="button">Đặt Lại Mật Khẩu</a>
    </center>
    <p style="text-align: center; font-size: 14px; color: #6B7280; margin-top: 20px;">
      Hoặc copy link sau vào trình duyệt:<br>
      <a href="${resetLink}" style="color: #833AB4; word-break: break-all;">${resetLink}</a>
    </p>
    <p style="text-align: center; font-size: 14px; color: #6B7280;">Link này sẽ hết hạn sau <strong>1 giờ</strong></p>
    <div class="divider"></div>
    <p style="font-size: 14px; color: #6B7280;">
      Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này và đảm bảo tài khoản của bạn được bảo mật.
    </p>
  `;
  return getBaseTemplate(content);
};

/**
 * Friend Request Email Template
 */
export const getFriendRequestTemplate = (recipientName, senderName) => {
  const content = `
    <h1>Lời Mời Kết Bạn Mới! 👋</h1>
    <p>Xin chào <strong>${recipientName}</strong>,</p>
    <p><strong>${senderName}</strong> đã gửi lời mời kết bạn cho bạn trên Chatzy!</p>
    <center>
      <a href="${process.env.CLIENT_URL}/friends/requests" class="button">Xem Lời Mời</a>
    </center>
    <div class="divider"></div>
    <p style="font-size: 14px; color: #6B7280;">
      Kết nối với bạn bè và bắt đầu trò chuyện ngay hôm nay!
    </p>
  `;
  return getBaseTemplate(content);
};

/**
 * New Message Notification Template
 */
export const getNewMessageTemplate = (
  recipientName,
  senderName,
  messagePreview
) => {
  const content = `
    <h1>Tin Nhắn Mới Từ ${senderName} 💬</h1>
    <p>Xin chào <strong>${recipientName}</strong>,</p>
    <p>Bạn có tin nhắn mới trên Chatzy:</p>
    <div class="code-box" style="text-align: left; background: linear-gradient(135deg, rgba(131, 58, 180, 0.05) 0%, rgba(253, 29, 29, 0.05) 100%);">
      <p style="color: #111827; font-size: 14px; font-style: italic; margin: 0;">
        "${messagePreview}"
      </p>
    </div>
    <center>
      <a href="${process.env.CLIENT_URL}/chats" class="button">Mở Chat</a>
    </center>
  `;
  return getBaseTemplate(content);
};
