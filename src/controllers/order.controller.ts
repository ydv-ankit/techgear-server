import { Response } from "express";
import ApiResponse from "../utils/ApiResponse";
import { CONSTANTS } from "../utils/constants";
import prisma from "../lib/prisma/db";
import { UserRequest } from "../types/UserRequest";
import { createPaypalAuth } from "../lib/paypal/paypal";

const placeNewOrder = async (req: UserRequest, res: Response) => {
  try {
    const { products, total_price, address_id } = req.body;
    if (!products || !total_price || !address_id) {
      return res
        .status(400)
        .json(new ApiResponse(CONSTANTS.MESSAGES.MISSING_FIELDS));
    }
    // get user address
    const userAddress = await prisma.address.findUnique({
      where: {
        id: address_id,
      },
    });

    const userData = await prisma.user.findUnique({
      where: {
        id: req.user!.id,
      },
    });

    // TODO: generate payment link
    const paypalAuth = await createPaypalAuth();

    const paymentBody = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: total_price,
          },
          shipping: {
            name: {
              full_name: userData?.name,
            },
            address: {
              address_line_1: userAddress?.address_line_1,
              address_line_2: userAddress?.address_line_2,
              admin_area_2: userAddress?.street_name,
              admin_area_1: userAddress?.city,
              postal_code: userAddress?.postal_code,
              country_code: "IN",
            },
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            brand_name: "Ankit Tech Store",
            locale: "en-US",
            landing_page: "LOGIN",
            shipping_preference: "SET_PROVIDED_ADDRESS",
            user_action: "PAY_NOW",
            return_url: `${process.env.CLIENT_URL}/payment`,
            cancel_url: `${process.env.CLIENT_URL}/payment`,
          },
        },
      },
    };

    const createOrder = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${paypalAuth?.accessToken}`,
        },
        body: JSON.stringify(paymentBody),
      },
    );
    const urls = await createOrder.json();

    let paymentLink = "";
    urls.links.forEach((link: { rel: string; href: string }) => {
      if (link.rel === "payer-action") {
        paymentLink = link.href;
      }
    });

    const payment_id = paymentLink?.split("?")[1].split("=")[1];
    const placeOrder = await prisma.order.create({
      data: {
        user_id: req.user!.id,
        products: products,
        payment_price: parseInt(total_price),
        payment_id,
      },
    });

    // send response
    res.status(201).json(
      new ApiResponse(CONSTANTS.MESSAGES.ORDER_PLACED, {
        link: paymentLink,
        placeOrder,
      }),
    );
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR));
  }
};

const getUserOrders = async (req: UserRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        user_id: req.user!.id,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(CONSTANTS.MESSAGES.ORDER_FOUND, orders));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR));
  }
};

const getOrderById = async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });
    res
      .status(200)
      .json(new ApiResponse(CONSTANTS.MESSAGES.ORDER_FOUND, order));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR));
  }
};

const getAllOrders = async (req: UserRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany();
    res
      .status(200)
      .json(new ApiResponse(CONSTANTS.MESSAGES.ORDER_FOUND, orders));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR));
  }
};

const updateOrderById = async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;
    await prisma.order.update({
      where: {
        id,
      },
      data: {
        payment_status,
      },
    });
    res.status(200).json(new ApiResponse(CONSTANTS.MESSAGES.ORDER_PLACED));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR));
  }
};

export {
  placeNewOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderById,
};
