import { Router } from "express";
import subcategoria from "../controllers/Subcategoria.controller.js";
const router = Router();

// Get
router.get("/subcategorias", subcategoria.getsubCategorias);

// Create
router.post("/subcategorias", subcategoria.createsubCategoria);

// Update
router.put("/subcategorias/:id", subcategoria.updatesubCategoria);

// Delete
router.delete("/subcategorias/:id", subcategoria.deletesubCategoria);

export default router;
