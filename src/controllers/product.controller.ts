import { Request, Response } from "express";
import { uploadImage } from "../lib/cloudinary/config";
import ApiResponse from "../utils/ApiResponse";
import { CONSTANTS } from "../utils/constants";
import prisma from "../lib/prisma/db";

const createProduct = async (req: Request, res: Response) => {
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

const productDetailsById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) {
      return res.status(404).json(new ApiResponse(CONSTANTS.MESSAGES.PRODUCT_NOT_FOUND, null));
    }
    res.status(200).json(new ApiResponse(CONSTANTS.MESSAGES.PRODUCT_FOUND, product));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR, null));
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(new ApiResponse(CONSTANTS.MESSAGES.PRODUCT_FOUND, products));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR, null));
  }
};

const updateProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, discount } = req.body;
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) {
      return res.status(404).json(new ApiResponse(CONSTANTS.MESSAGES.PRODUCT_NOT_FOUND, null));
    }
    await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name,
        price: parseInt(price),
        discount: parseInt(discount),
      },
    });
    res.status(200).json(new ApiResponse(CONSTANTS.MESSAGES.PRODUCT_UPDATED, null));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR, null));
  }
};

const deleteProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) {
      return res.status(404).json(new ApiResponse(CONSTANTS.MESSAGES.PRODUCT_NOT_FOUND, null));
    }
    await prisma.product.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(new ApiResponse(CONSTANTS.MESSAGES.PRODUCT_DELETED, null));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR, null));
  }
};

export { createProduct, productDetailsById, getAllProducts, updateProductById, deleteProductById };
