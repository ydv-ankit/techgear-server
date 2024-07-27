import { Request, Response } from "express";
import { uploadImage } from "../lib/cloudinary/config";
import ApiResponse from "../utils/ApiResponse";
import { CONSTANTS } from "../utils/constants";
import prisma from "../lib/prisma/db";

const create = async (req: Request, res: Response) => {
  const filepath = req.file?.path;
  const { name, price, discount } = req.body;

  if (!name || !price || !discount) {
    return res.status(400).json(new ApiResponse(CONSTANTS.MESSAGES.MISSING_FIELDS, null));
  }
  if (!filepath) {
    return res.status(400).json(new ApiResponse(CONSTANTS.MESSAGES.FILE_NOT_FOUND, null));
  }
  try {
    const uploadedImage = await uploadImage(filepath);
    await prisma.product.create({
      data: {
        name,
        price: parseInt(price),
        image: uploadedImage.data.secure_url,
        discount: parseInt(discount),
        no_of_sales: 0,
      },
    });
    res.status(201).json(new ApiResponse(CONSTANTS.MESSAGES.PRODUCT_CREATED, null));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR, null));
  }
};

export { create };
