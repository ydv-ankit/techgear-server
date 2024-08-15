import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import * as productController from "../controllers/product.controller";
const router = Router();

router.post(
  "/create",
  upload.single("prod_img"),
  productController.createProduct,
);
router.get("/all", productController.getAllProducts);
router.get("/:id", productController.productDetailsById);
router.put("/:id", productController.updateProductById);
router.delete("/:id", productController.deleteProductById);

export default router;
