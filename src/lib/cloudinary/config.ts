const { v2: cloudinary } = require("cloudinary");
import fs from "fs";

export const uploadImage = async (imagePath: string) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      asset_folder: "techgear",
    });
    fs.unlinkSync(imagePath);
    return { data: result };
  } catch (error) {
    return { error };
  }
};
