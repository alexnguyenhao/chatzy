// Application Constants

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  MODERATOR: "moderator",
};

export const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
  VIDEO: "video",
  AUDIO: "audio",
};

export const CHAT_TYPES = {
  PRIVATE: "private",
  GROUP: "group",
};

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: "connection",
  DISCONNECT: "disconnect",

  // Chat events
  JOIN_ROOM: "join_room",
  LEAVE_ROOM: "leave_room",
  SEND_MESSAGE: "send_message",
  RECEIVE_MESSAGE: "receive_message",

  // Typing indicators
  TYPING_START: "typing_start",
  TYPING_STOP: "typing_stop",

  // User status
  USER_ONLINE: "user_online",
  USER_OFFLINE: "user_offline",

  // Message status
  MESSAGE_DELIVERED: "message_delivered",
  MESSAGE_READ: "message_read",
};

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
  ALLOWED_FILE_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const TOKEN = {
  EXPIRES_IN: "7d",
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};
