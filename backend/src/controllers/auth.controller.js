import authService from "../services/auth.service.js";
import {
  sendSuccess,
  sendError,
  asyncHandler,
} from "../utils/response.utils.js";
import { setTokenCookie, clearTokenCookie } from "../utils/jwt.utils.js";

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);

  setTokenCookie(res, token);
  sendSuccess(res, 201, "Đăng ký thành công", { user, token });
});

/**
 * Login user
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);

  setTokenCookie(res, token);
  sendSuccess(res, 200, "Đăng nhập thành công", { user, token });
});

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.userId);

  clearTokenCookie(res);
  sendSuccess(res, 200, "Đăng xuất thành công");
});

/**
 * Get current user
 * GET /api/auth/me
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.userId);
  sendSuccess(res, 200, "Success", user);
});

/**
 * Change password
 * POST /api/auth/change-password
 */
export const changePassword = asyncHandler(async (req, res) => {
  const result = await authService.changePassword(req.userId, req.body);
  sendSuccess(res, 200, result.message);
});

/**
 * Request password reset
 * POST /api/auth/reset-password-request
 */
export const resetPasswordRequest = asyncHandler(async (req, res) => {
  const result = await authService.resetPasswordRequest(req.body.email);
  sendSuccess(res, 200, result.message);
});

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const result = await authService.resetPassword(token, newPassword);
  sendSuccess(res, 200, result.message);
});

/**
 * Refresh token
 * POST /api/auth/refresh-token
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { token } = await authService.refreshToken(req.userId);

  setTokenCookie(res, token);
  sendSuccess(res, 200, "Token refreshed", { token });
});
