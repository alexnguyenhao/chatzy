/**
 * String and data manipulation utilities
 */

/**
 * Slugify a string
 * @param {string} str - String to slugify
 * @returns {string} - Slugified string
 */
export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncate = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Generate random string
 * @param {number} length - Length of random string
 * @returns {string} - Random string
 */
export const randomString = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Format date to Vietnamese
 * @param {Date} date - Date object
 * @returns {string} - Formatted date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Get time ago in Vietnamese
 * @param {Date} date - Date object
 * @returns {string} - Time ago string
 */
export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + " năm trước";

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + " tháng trước";

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + " ngày trước";

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " giờ trước";

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + " phút trước";

  return "Vừa xong";
};

/**
 * Sanitize object (remove undefined/null values)
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
export const sanitizeObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null && v !== "")
  );
};
