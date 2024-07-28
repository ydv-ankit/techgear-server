import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import * as productController from "../controllers/product.controller";
import authMiddleware from "../middlewares/auth.middleware";
const router = Router();

router.post("/create", authMiddleware, upload.single("prod_img"), productController.create);
router.get("/all", authMiddleware, productController.getAllProducts);
router.get("/:id", authMiddleware, productController.productDetails);
router.put("/:id", authMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);

export default router;
