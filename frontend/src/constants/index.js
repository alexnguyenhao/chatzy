/**
 * API endpoints constants
 */
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",

  // Users
  USERS: "/users",
  USER_BY_ID: (id) => `/users/${id}`,

  // Chat
  MESSAGES: "/messages",
  CONVERSATIONS: "/conversations",
};

/**
 * Query keys for TanStack Query
 */
export const QUERY_KEYS = {
  // Auth
  CURRENT_USER: ["currentUser"],

  // Users
  USERS: ["users"],
  USER: (id) => ["user", id],

  // Chat
  MESSAGES: (conversationId) => ["messages", conversationId],
  CONVERSATIONS: ["conversations"],
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
};

/**
 * Routes
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  CHAT: "/chat",
  PROFILE: "/profile",
};
