import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import * as productController from "../controllers/product.controller";
import authMiddleware from "../middlewares/auth.middleware";
const router = Router();

router.post(
  "/create",
  authMiddleware,
  upload.single("image"),
  productController.createProduct,
);
router.get("/all", productController.getAllProducts);
router.get("/:id", authMiddleware, productController.productDetailsById);
router.put("/:id", authMiddleware, productController.updateProductById);
router.delete("/:id", authMiddleware, productController.deleteProductById);

export default router;
