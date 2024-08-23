import { Router } from "express";
import * as orderController from "../controllers/order.controller";

const router = Router();

router.post("/", orderController.placeNewOrder);
router.get("/", orderController.getUserOrders);
router.get("/all", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id", orderController.updateOrderById);

export default router;
