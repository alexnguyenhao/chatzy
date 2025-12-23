import {
  sendSuccess,
  sendError,
  asyncHandler,
} from "../utils/response.utils.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.utils.js";

/**
 * Upload image
 * POST /api/upload/image
 */
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendError(res, 400, "Không có file được upload");
  }

  const result = await uploadToCloudinary(req.file.buffer, "images", "image");

  sendSuccess(res, 200, "Upload thành công", {
    url: result.secure_url,
    publicId: result.public_id,
  });
});

/**
 * Upload video
 * POST /api/upload/video
 */
export const uploadVideo = asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendError(res, 400, "Không có file được upload");
  }

  const result = await uploadToCloudinary(req.file.buffer, "videos", "video");

  sendSuccess(res, 200, "Upload thành công", {
    url: result.secure_url,
    publicId: result.public_id,
  });
});

/**
 * Upload file (PDF, DOC, etc.)
 * POST /api/upload/file
 */
export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendError(res, 400, "Không có file được upload");
  }

  const result = await uploadToCloudinary(req.file.buffer, "files", "raw");

  sendSuccess(res, 200, "Upload thành công", {
    url: result.secure_url,
    publicId: result.public_id,
    fileName: req.file.originalname,
  });
});

/**
 * Delete file from Cloudinary
 * DELETE /api/upload/:publicId
 */
export const deleteFile = asyncHandler(async (req, res) => {
  const { publicId } = req.params;
  const { resourceType } = req.query; // image, video, raw

  await deleteFromCloudinary(publicId, resourceType || "image");

  sendSuccess(res, 200, "Xóa file thành công");
});
