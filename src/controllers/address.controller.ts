import { Response } from "express";
import { UserRequest } from "../types/UserRequest";
import ApiResponse from "../utils/ApiResponse";
import { CONSTANTS } from "../utils/constants";
import prisma from "../lib/prisma/db";

const addAddress = async (req: UserRequest, res: Response) => {
  try {
    const { address } = req.body;
    const addressResponse = await prisma.address.create({
      data: {
        address,
        user_id: req.user!.id,
      },
    });
    res.status(201).json(new ApiResponse(CONSTANTS.MESSAGES.ADDRESS_ADDED, addressResponse));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR, null));
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
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR, null));
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
    res.status(200).json(new ApiResponse(CONSTANTS.MESSAGES.ADDRESS_FOUND, addressResponse));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR, null));
  }
};

const getAllAddresses = async (req: UserRequest, res: Response) => {
  try {
    const addressResponse = await prisma.address.findMany();
    res.status(200).json(new ApiResponse(CONSTANTS.MESSAGES.ADDRESS_FOUND, addressResponse));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR, null));
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
        address,
      },
    });
    res.status(200).json(new ApiResponse(CONSTANTS.MESSAGES.ADDRESS_UPDATED, null));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR, null));
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
    res.status(200).json(new ApiResponse(CONSTANTS.MESSAGES.ADDRESS_DELETED, null));
  } catch (error) {
    res.status(500).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR, null));
  }
};

export { addAddress, getUserAddresses, getAddressById, getAllAddresses, updateAddressById, deleteAddressById };
