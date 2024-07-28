import { Router } from "express";

import * as ratingController from "../controllers/rating.controller";

const router = Router();

router.post("/", ratingController.addRating);
router.get("/all", ratingController.getAllRatings);

export default router;
