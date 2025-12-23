// Simple in-memory rate limiter
const requestCounts = new Map();

export const rateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // limit each IP to 100 requests per windowMs
    message = "Quá nhiều yêu cầu, vui lòng thử lại sau",
  } = options;

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    for (const [key, data] of requestCounts.entries()) {
      if (data.resetTime < now) {
        requestCounts.delete(key);
      }
    }

    // Get or create entry for this IP
    let requestData = requestCounts.get(ip);
    if (!requestData || requestData.resetTime < now) {
      requestData = {
        count: 0,
        resetTime: now + windowMs,
      };
      requestCounts.set(ip, requestData);
    }

    // Increment request count
    requestData.count++;

    // Check if limit exceeded
    if (requestData.count > max) {
      return res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil((requestData.resetTime - now) / 1000),
      });
    }

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader(
      "X-RateLimit-Remaining",
      Math.max(0, max - requestData.count)
    );
    res.setHeader("X-RateLimit-Reset", Math.ceil(requestData.resetTime / 1000));

    next();
  };
};

// Stricter rate limiter for sensitive routes (login, register, etc.)
export const strictRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Quá nhiều lần thử, vui lòng thử lại sau 15 phút",
});

// Standard rate limiter for API routes
export const apiRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests
  message: "Quá nhiều yêu cầu, vui lòng thử lại sau",
});
