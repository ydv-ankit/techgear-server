import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import * as productController from "../controllers/product.controller";
const router = Router();

router.post("/create", upload.single("prod_img"), productController.create);
router.get("/all", productController.getAllProducts);
router.get("/:id", productController.productDetails);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
