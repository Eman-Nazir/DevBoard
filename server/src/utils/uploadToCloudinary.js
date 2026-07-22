import { cloudinary } from "../config/cloudinary.js";
import fs from "fs";


const uploadToCloudinary = async (localFilePath, folder = "devboard") => {
  if (!localFilePath) return null;

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: "auto",
      transformation: [
        { width: 200, height: 200, crop: "fill", gravity: "face" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });
    return result.secure_url;
  } catch (error) {
    console.error("[Cloudinary] Upload failed:", error.message);
    return null;
  } finally {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  }
};


const deleteFromCloudinary = async (url) => {
  if (!url) return;
  try {
    // Extract public_id from URL
    const parts = url.split("/upload/");
    if (parts.length < 2) return;
    const publicIdWithExt = parts[1];
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("[Cloudinary] Delete failed:", error.message);
  }
};

export { uploadToCloudinary, deleteFromCloudinary };