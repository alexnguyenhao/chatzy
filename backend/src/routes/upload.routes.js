import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { uploadSingle } from "../config/multer.js";
import * as uploadController from "../controllers/upload.controller.js";

const router = express.Router();

// Upload image
router.post(
  "/image",
  verifyToken,
  uploadSingle("image"),
  uploadController.uploadImage
);

// Upload video
router.post(
  "/video",
  verifyToken,
  uploadSingle("video"),
  uploadController.uploadVideo
);

// Upload file (PDF, DOC, etc.)
router.post(
  "/file",
  verifyToken,
  uploadSingle("file"),
  uploadController.uploadFile
);

// Delete file from Cloudinary
router.delete("/:publicId", verifyToken, uploadController.deleteFile);

export default router;
