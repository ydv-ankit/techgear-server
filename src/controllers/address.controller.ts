import { Response } from "express";
import { UserRequest } from "../types/UserRequest";
import ApiResponse from "../utils/ApiResponse";
import { CONSTANTS } from "../utils/constants";
import prisma from "../lib/prisma/db";

const addAddress = async (req: UserRequest, res: Response) => {
  try {
    const { user_address } = req.body;
    const addressResponse = await prisma.address.create({
      data: {
        address_line_1: user_address.address_line_1,
        address_line_2: user_address.address_line_2,
        street_name: user_address.street_name,
        city: user_address.city,
        postal_code: user_address.postal_code,
        country: user_address.country,
        user_id: req.user!.id,
      },
    });
    res.status(201).json(new ApiResponse(CONSTANTS.MESSAGES.ADDRESS_ADDED, addressResponse));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR));
  }
};

const getUserAddresses = async (req: UserRequest, res: Response) => {
  try {
    const addressResponse = await prisma.address.findMany({
      where: {
        user_id: req.user!.id,
      },
    });
    res.status(200).json(new ApiResponse(CONSTANTS.MESSAGES.ADDRESS_FOUND, addressResponse));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR));
  }
};

const getAddressById = async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const addressResponse = await prisma.address.findUnique({
      where: {
        id,
      },
    });
    res.status(200).json(new ApiResponse(CONSTANTS.MESSAGES.ADDRESS_FOUND, addressResponse!));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR));
  }
};

const getAllAddresses = async (req: UserRequest, res: Response) => {
  try {
    const addressResponse = await prisma.address.findMany();
    res.status(200).json(new ApiResponse(CONSTANTS.MESSAGES.ADDRESS_FOUND, addressResponse));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR));
  }
};

const updateAddressById = async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { address } = req.body;
    await prisma.address.update({
      where: {
        id,
      },
      data: {
        address_line_1: address.address_line_1,
        address_line_2: address.address_line_2,
        street_name: address.street_name,
        city: address.city,
        postal_code: address.postal_code,
        country: address.country,
      },
    });
    res.status(200).json(new ApiResponse(CONSTANTS.MESSAGES.ADDRESS_UPDATED));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR));
  }
};

const deleteAddressById = async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.address.delete({
      where: {
        id,
      },
    });
    res.status(200).json(new ApiResponse(CONSTANTS.MESSAGES.ADDRESS_DELETED));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR));
  }
};

export { addAddress, getUserAddresses, getAddressById, getAllAddresses, updateAddressById, deleteAddressById };
