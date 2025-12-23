export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
  USERS: "/users",
  USER_BY_ID: (id) => `/users/${id}`,
  MESSAGES: "/messages",
  CONVERSATIONS: "/conversations",
};

export const QUERY_KEYS = {
  CURRENT_USER: ["currentUser"],
  USERS: ["users"],
  USER: (id) => ["user", id],
  MESSAGES: (conversationId) => ["messages", conversationId],
  CONVERSATIONS: ["conversations"],
};

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
};

export const ROUTES = {
  HOME: "/",
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  CHAT: "/chat",
  PROFILE: "/profile",
};
