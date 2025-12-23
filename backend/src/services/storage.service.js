import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.utils.js";

class StorageService {
  /**
   * Upload image to Cloudinary
   * @param {Buffer} fileBuffer
   * @param {String} folder - Cloudinary folder
   */
  async uploadImage(fileBuffer, folder = "images") {
    const result = await uploadToCloudinary(fileBuffer, folder, "image");
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    };
  }

  /**
   * Upload video to Cloudinary
   * @param {Buffer} fileBuffer
   * @param {String} folder - Cloudinary folder
   */
  async uploadVideo(fileBuffer, folder = "videos") {
    const result = await uploadToCloudinary(fileBuffer, folder, "video");
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      duration: result.duration,
    };
  }

  /**
   * Upload file (PDF, DOC, etc.) to Cloudinary
   * @param {Buffer} fileBuffer
   * @param {String} folder - Cloudinary folder
   * @param {String} fileName - Original file name
   */
  async uploadFile(fileBuffer, folder = "files", fileName) {
    const result = await uploadToCloudinary(fileBuffer, folder, "raw");
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
      fileName,
    };
  }

  /**
   * Delete file from Cloudinary
   * @param {String} publicId
   * @param {String} resourceType - image, video, raw
   */
  async deleteFile(publicId, resourceType = "image") {
    await deleteFromCloudinary(publicId, resourceType);
    return { message: "File deleted successfully" };
  }

  /**
   * Upload avatar
   * @param {Buffer} fileBuffer
   * @param {String} userId
   */
  async uploadAvatar(fileBuffer, userId) {
    return this.uploadImage(fileBuffer, `avatars/${userId}`);
  }

  /**
   * Upload post media
   * @param {Buffer} fileBuffer
   * @param {String} type - image or video
   */
  async uploadPostMedia(fileBuffer, type = "image") {
    if (type === "video") {
      return this.uploadVideo(fileBuffer, "posts/videos");
    }
    return this.uploadImage(fileBuffer, "posts/images");
  }

  /**
   * Upload message attachment
   * @param {Buffer} fileBuffer
   * @param {String} type - image, video, file
   * @param {String} fileName
   */
  async uploadMessageAttachment(fileBuffer, type, fileName) {
    switch (type) {
      case "image":
        return this.uploadImage(fileBuffer, "messages/images");
      case "video":
        return this.uploadVideo(fileBuffer, "messages/videos");
      case "file":
        return this.uploadFile(fileBuffer, "messages/files", fileName);
      default:
        return this.uploadFile(fileBuffer, "messages/files", fileName);
    }
  }
}

export default new StorageService();
