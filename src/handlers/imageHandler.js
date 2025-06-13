import cloudinary from "../config/cloudinaryConfig.js";

// upload single image function for now it no used
export const uploadSingleImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "updated-mern-ecom",
      transformation: {
        width: 800,
        height: 600,
        crop: "fill",
        gravity: "center",
        quality: "auto:eco",
        format: "auto",
        //format: "webp",
      },
    });
    return { secure_url: result.secure_url, public_id: result.public_id };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

// Handler for uploading multiple images
export const uploadMultipleImages = async (files) => {
  try {
    const uploadedImages = [];

    // Loop through each file and upload it
    for (let file of files) {
      const uploadedImage = await uploadSingleImage(file);
      uploadedImages.push(uploadedImage);
    }

    return uploadedImages;
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw new Error("Failed to upload images");
  }
};

// delete single image from cloudinary
export const deleteImage = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};
// delete multiple image from cloudinary
// Delete multiple images from Cloudinary
export async function deleteMultipleImages(public_ids) {
  try {
    const deletePromises = public_ids.map((public_id) => {
      if (!public_id) {
        throw new Error("Missing public_id for deletion");
      }
      return deleteImage(public_id); // Pass the public_id to deleteImage function
    });
    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    console.error("Error deleting multiple images from Cloudinary:", error);
    throw new Error("Failed to delete images from Cloudinary");
  }
}
