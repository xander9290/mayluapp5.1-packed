import { Router } from "express";
import almacenController from "../controllers/Almacen.controller.js";
const router = Router();

// get
router.get("/almacenes", almacenController.getAlmacenes);

// create
router.post("/almacenes", almacenController.createAlmacen);

// update
router.put("/almacenes/:id", almacenController.updateAlmacenes);

// delete
router.delete("/almacenes/:id", almacenController.deleteAlmacenes);

export default router;
