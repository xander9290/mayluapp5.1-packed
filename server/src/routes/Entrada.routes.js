import { Router } from "express";
import entrada from "../controllers/Entrada.controller.js";
const router = Router();

// create Entrada
router.post("/entradas", entrada.createEntrada);

// get entradas por almacen
router.get("/entradas/almacen/:id", entrada.getEntradasByAlmacen);

// get entradas por fecha
router.get("/entradas/byFecha/:fecha", entrada.getEntradasByFecha);

// delete entrada
router.delete("/entradas/:id", entrada.deleteEntrada);

export default router;
