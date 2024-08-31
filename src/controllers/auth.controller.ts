import { Request, Response } from "express";
import prisma from "../lib/prisma/db";
import ApiResponse from "../utils/ApiResponse";
import { CONSTANTS } from "../utils/constants";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { hashPassword } from "../utils/bcrypt";

const generateRefreshAndAccessToken = (userid: string) => {
  const refreshToken = jwt.sign({ userid }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  });
  const accessToken = jwt.sign({ userid }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h",
  });
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
      return res
        .status(400)
        .json(new ApiResponse(CONSTANTS.MESSAGES.USER_ALREADY_EXISTS));
    }
    const hashedPasswd = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPasswd,
        avatar: `https://avatar.iran.liara.run/username?username=${name}`,
      },
    });
    const { refreshToken, accessToken } = generateRefreshAndAccessToken(
      newUser?.id,
    );
    res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .status(201)
      .json(
        new ApiResponse(CONSTANTS.MESSAGES.USER_CREATED, { user: newUser }),
      );
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR, { error }),
      );
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // for admins
    if (email === "ankit@admin.com" && password === "Ankit@admin123") {
      const { refreshToken, accessToken } =
        generateRefreshAndAccessToken("ankit@admin.com");
      return res
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(
          new ApiResponse("Admin found", {
            user: {
              id: "1001",
              role: "admin",
              name: "Ankit Ydv",
              email: "ankit@admin.com",
              avatar: `https://avatar.iran.liara.run/username?username=Ankit`,
            },
          }),
        );
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res
        .status(400)
        .json(new ApiResponse(CONSTANTS.MESSAGES.USER_NOT_FOUND));
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (isCorrectPassword) {
      const { refreshToken, accessToken } = generateRefreshAndAccessToken(
        user?.id,
      );
      res
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .status(200)
        .json(
          new ApiResponse(CONSTANTS.MESSAGES.USER_LOGGED_IN, {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
            },
          }),
        );
    } else {
      res
        .status(400)
        .json(new ApiResponse(CONSTANTS.MESSAGES.INVALID_CREDENTIALS));
    }
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiResponse(CONSTANTS.MESSAGES.INTERNAL_SERVER_ERROR, { error }),
      );
  }
};

const logout = async (req: Request, res: Response) => {
  res
    .clearCookie("refreshToken", cookieOptions)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(CONSTANTS.MESSAGES.USER_LOGGED_OUT));
};

const generateNewToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  try {
    const refreshTokenPayload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    );
    const { userid } = refreshTokenPayload as jwt.JwtPayload;
    const { accessToken, refreshToken: newRefreshToken } =
      generateRefreshAndAccessToken(userid);
    const user = await prisma.user.update({
      where: { id: userid },
      data: { refreshToken: newRefreshToken, accessToken: accessToken },
    });
    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(CONSTANTS.MESSAGES.USER_LOGGED_IN, {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }),
      );
  } catch (error) {
    res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .status(401)
      .json(new ApiResponse(CONSTANTS.MESSAGES.USER_LOGIN_REQUIRED, { error }));
  }
};

export = {
  login,
  register,
  logout,
  generateNewToken,
};
