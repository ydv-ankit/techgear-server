import { Router } from "express";

import * as ratingController from "../controllers/rating.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, ratingController.addRating);

export default router;
