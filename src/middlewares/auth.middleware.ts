import { NextFunction, Request, Response } from "express";
import { CONSTANTS } from "../utils/constants";
import ApiResponse from "../utils/ApiResponse";
import jwt, { JwtPayload } from "jsonwebtoken";

interface UserRequest extends Request {
  user: {
    userid: number;
  };
}

const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
  const { accessToken } = req.cookies;
  try {
    const accessTokenPayload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
    req.user.userid = (accessTokenPayload as JwtPayload)?.userid;
    next();
  } catch (error) {
    res.status(401).json(new ApiResponse(CONSTANTS.MESSAGES.USER_LOGIN_REQUIRED, null));
  }
};

export default authMiddleware;
