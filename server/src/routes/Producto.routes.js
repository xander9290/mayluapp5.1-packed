import { Router } from "express";
import producto from "../controllers/Producto.controller.js";
const router = Router();

// get
router.get("/productos", producto.getProductos);

// create
router.post("/productos", producto.createProducto);

// update
router.put("/productos/:id", producto.updateProducto);

// delete
router.delete("/productos/:id", producto.deleteProducto);

export default router;
