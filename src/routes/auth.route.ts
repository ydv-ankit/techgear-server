import { Router } from "express";
import authController from "../controllers/auth.controller";

const router = Router();

router.post("/login", authController.login);
router.post("/new", authController.register);
router.get("/refresh", authController.generateNewToken);

export default router;
