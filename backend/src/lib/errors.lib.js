/**
 * Custom Error Classes
 */

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Dữ liệu không hợp lệ") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Không có quyền truy cập") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Truy cập bị từ chối") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Không tìm thấy") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Xung đột dữ liệu") {
    super(message, 409);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Lỗi máy chủ") {
    super(message, 500);
  }
}
