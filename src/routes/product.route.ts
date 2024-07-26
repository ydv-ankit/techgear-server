import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.post("/create", upload.single("prod_img"), (req, res) => {
  console.log(req.file);
  res.send("create product");
});

router.get("/get", (req, res) => {
  res.send("get product");
});

export default router;
