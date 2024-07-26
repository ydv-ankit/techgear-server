import { Request, Response } from "express";
import prisma from "../lib/prisma/db";
import ApiResponse from "../utils/ApiResponse";
import { CONSTANTS } from "../utils/constants";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateRefreshAndAccessToken = (userid: string) => {
  const refreshToken = jwt.sign({ userid }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" });
  const accessToken = jwt.sign({ userid }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h" });
  return { refreshToken, accessToken };
};

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await prisma.user.findUnique({
      where: { email },
    });
    if (userExists) {
      return res.status(CONSTANTS.RESPONSE_CODE.BAD_REQUEST).json(new ApiResponse(CONSTANTS.MESSAGES.USER_ALREADY_EXISTS, null));
    }
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        avatar: `https://avatar.iran.liara.run/username?username=${name}`,
      },
    });
    res.status(CONSTANTS.RESPONSE_CODE.CREATED).json(new ApiResponse(CONSTANTS.MESSAGES.USER_CREATED, null));
  } catch (error) {
    res.status(CONSTANTS.RESPONSE_CODE.INTERNAL_SERVER_ERROR).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR, null));
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(CONSTANTS.RESPONSE_CODE.BAD_REQUEST).json(new ApiResponse(CONSTANTS.MESSAGES.USER_NOT_FOUND, null));
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (isCorrectPassword) {
      const { refreshToken, accessToken } = generateRefreshAndAccessToken(user?.id);
      res
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .status(CONSTANTS.RESPONSE_CODE.SUCCESS)
        .json(
          new ApiResponse(CONSTANTS.MESSAGES.USER_LOGGED_IN, {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
            },
          })
        );
    } else {
      res.status(CONSTANTS.RESPONSE_CODE.BAD_REQUEST).json(new ApiResponse(CONSTANTS.MESSAGES.INVALID_CREDENTIALS, null));
    }
  } catch (error) {
    res.status(CONSTANTS.RESPONSE_CODE.INTERNAL_SERVER_ERROR).json(new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR, null));
  }
};

const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", cookieOptions).clearCookie("accessToken", cookieOptions).json(new ApiResponse(CONSTANTS.MESSAGES.USER_LOGGED_OUT, null));
};

const generateNewToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  try {
    const refreshTokenPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    const { userid } = refreshTokenPayload as jwt.JwtPayload;
    console.log(userid);

    const { accessToken } = generateRefreshAndAccessToken(userid);
    res.cookie("accessToken", accessToken, cookieOptions).status(CONSTANTS.RESPONSE_CODE.SUCCESS).json(new ApiResponse(null, null));
  } catch (error) {
    res.status(CONSTANTS.RESPONSE_CODE.UNAUTHORIZED).json(new ApiResponse(CONSTANTS.MESSAGES.USER_LOGIN_REQUIRED, null));
  }
};

export = {
  login,
  register,
  logout,
  generateNewToken,
};
