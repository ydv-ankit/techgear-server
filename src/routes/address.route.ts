import { Router } from "express";
import * as addressController from "../controllers/address.controller";

const router = Router();

router.post("/", addressController.addAddress);
router.get("/", addressController.getUserAddresses);
router.get("/:id", addressController.getAddressById);
router.get("/all", addressController.getAllAddresses);
router.put("/:id", addressController.updateAddressById);
router.delete("/:id", addressController.deleteAddressById);

export default router;
