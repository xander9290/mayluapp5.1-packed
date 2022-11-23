import { Router } from "express";
import categoria from "../controllers/Categoria.controller.js";
const router = Router();

// Get
router.get("/categorias", categoria.getCategorias);

// Create
router.post("/categorias", categoria.createCategoria);

// Update
router.put("/categorias/:id", categoria.updateCategoria);

// Delete
router.delete("/categorias/:id", categoria.deleteCategoria);

export default router;
