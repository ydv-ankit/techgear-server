import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import * as productController from "../controllers/product.controller";
const router = Router();

router.post("/create", upload.single("prod_img"), productController.create);

export default router;
