import path from "path";

const { v2: cloudinary } = require("cloudinary");

export const uploadImage = async (imagePath: path.FormatInputPathObject) => {
  console.log("imagePath", imagePath);

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      asset_folder: "techgear",
    });
    return { data: result };
  } catch (error) {
    return { error };
  }
};
