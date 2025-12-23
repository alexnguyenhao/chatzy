# Chatzy Backend API

Complete REST API with real-time messaging for Chatzy chat application.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Real-time:** Socket.IO
- **Authentication:** JWT
- **Email:** SendGrid
- **Storage:** Cloudinary
- **Validation:** Joi

## ✨ Features

- ✅ User authentication (register, login, password reset)
- ✅ Email verification with SendGrid
- ✅ Real-time messaging with Socket.IO
- ✅ Private & group chats
- ✅ Message requests (privacy feature)
- ✅ Friend system with blocking
- ✅ Social feed (posts, comments, likes, stories)
- ✅ File uploads (images, videos, documents)
- ✅ Push notifications
- ✅ Typing indicators
- ✅ Online/offline presence

## 📁 Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers (11)
├── lib/            # Utility libraries
├── middleware/     # Express middleware
├── models/         # Mongoose models (10)
├── routes/         # API routes (11)
├── schemas/        # Joi validation schemas
├── services/       # Business logic (10)
├── sockets/        # Socket.IO handlers
├── utils/          # Helper functions
├── app.js          # Express app
└── index.js        # Entry point
```

## 🔧 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure .env with your credentials:
# - MONGODB_URI
# - JWT_SECRET
# - SENDGRID_API_KEY
# - CLOUDINARY credentials
```

## 🏃 Running

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on: `http://localhost:5001`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/reset-password-request` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/refresh-token` - Refresh JWT

### Users

- `GET /api/users/search` - Search users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update profile
- `POST /api/users/avatar` - Upload avatar
- `PUT /api/users/status` - Update status

### Chats

- `GET /api/chats` - Get all chats
- `GET /api/chats/requests` - Get message requests
- `POST /api/chats` - Create chat
- `GET /api/chats/:id` - Get chat detail
- `PUT /api/chats/:id` - Update chat
- `DELETE /api/chats/:id` - Delete chat
- `POST /api/chats/:id/accept` - Accept message request
- `POST /api/chats/:id/decline` - Decline message request

### Messages

- `POST /api/messages` - Send message
- `GET /api/messages/:chatId` - Get messages
- `PUT /api/messages/:id` - Edit message
- `DELETE /api/messages/:id` - Delete message
- `POST /api/messages/:id/read` - Mark as read

### Posts, Comments, Likes, Stories, Friends, Notifications...

See full API documentation in `/docs`

## 🔌 Socket.IO Events

### Chat Events

- `chat:join` - Join chat room
- `chat:leave` - Leave chat room
- `message:send` - Send message
- `message:edit` - Edit message
- `message:delete` - Delete message
- `message:read` - Mark as read
- `message:delivered` - Mark as delivered

### Typing Events

- `typing:start` - User started typing
- `typing:stop` - User stopped typing

### Presence Events

- `user:online` - User came online
- `user:offline` - User went offline
- `status:update` - User status changed

See `socket_events.md` for complete documentation.

## 🗄️ Database Models

- User
- Chat
- Message
- FriendRequest
- BlockedUser
- Post
- Comment
- Like
- Story
- Notification

## 🔐 Environment Variables

Required variables in `.env`:

```env
PORT=5001
CLIENT_URL=http://localhost:5173

# MongoDB
MONGODB_URI=your_mongodb_uri

# JWT
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SendGrid
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@chatzy.com
SENDGRID_FROM_NAME=Chatzy
```

## 📧 Email Templates

Beautiful HTML emails with Instagram-inspired gradient design:

- Welcome email
- Email verification (6-digit code)
- Password reset
- Friend requests
- New messages

## 🧪 Testing

Use Postman or Thunder Client to test endpoints.

Example register request:

```bash
POST http://localhost:5001/api/auth/register
Content-Type: application/json

{
  "fullname": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```

## 🚀 Deployment

1. Set production environment variables
2. Ensure MongoDB is accessible
3. Verify SendGrid sender email
4. Deploy to your platform (Heroku, Railway, Render, etc.)

## 📝 Status

✅ **Production Ready**

- All core features implemented
- Comprehensive error handling
- Input validation on all endpoints
- Rate limiting configured
- Real-time features working
- Email service integrated

## 👨‍💻 Author

Alex Nguyen Hao

## 📄 License

MIT
