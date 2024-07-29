import { Response } from "express";
import ApiResponse from "../utils/ApiResponse";
import { CONSTANTS } from "../utils/constants";
import prisma from "../lib/prisma/db";
import { UserRequest } from "../types/UserRequest";

enum PAYMENT_STATUS {
  PENDING,
  SUCCESS,
}

const placeNewOrder = async (req: UserRequest, res: Response) => {
  try {
    const { products, total_price } = req.body;
    const order = await prisma.order.create({
      data: {
        products,
        user_id: req.user!.id,
        payment_price: total_price,
      },
    });

    // TODO: generate payment link

    // send response
    res.status(201).json(new ApiResponse(CONSTANTS.MESSAGES.ORDER_PLACED, order));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR));
  }
};

export { placeNewOrder };
