import { Request, Response, NextFunction } from "express";
import ApiResponse from "../utils/ApiResponse";
import { CONSTANTS } from "../utils/constants";
import prisma from "../lib/prisma/db";
import { UserRequest } from "../types/UserRequest";

const addRating = async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const { rating_score, product_id } = req.body;
    const user_id = req.user?.id;

    if (!user_id || !rating_score || !product_id) {
      return res.status(400).json(new ApiResponse(CONSTANTS.MESSAGES.MISSING_FIELDS, null));
    }

    const [product, existingRating] = await Promise.all([prisma.product.findUnique({ where: { id: product_id } }), prisma.rating.findFirst({ where: { productId: product_id, userId: user_id } })]);

    if (!product) {
      return res.status(404).json(new ApiResponse(CONSTANTS.MESSAGES.PRODUCT_NOT_FOUND, null));
    }

    if (existingRating) {
      return res.status(400).json(new ApiResponse(CONSTANTS.MESSAGES.RATING_ALREADY_EXISTS, null));
    }

    const score = parseInt(rating_score, 10);
    const rating = await prisma.rating.create({
      data: { score, productId: product_id, userId: user_id },
    });

    const updatedProductRating = product.rating ? product.rating + score / 2 : score;

    await prisma.product.update({
      where: { id: product_id },
      data: { rating: updatedProductRating },
    });

    res.status(201).json(new ApiResponse(CONSTANTS.MESSAGES.RATING_ADDED, rating));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR, null));
  }
};

const getAllRatings = async (req: Request, res: Response) => {
  try {
    const ratings = await prisma.rating.findMany();
    res.status(200).json(new ApiResponse(CONSTANTS.MESSAGES.RATING_FOUND, ratings));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR, null));
  }
};

export { addRating, getAllRatings };
