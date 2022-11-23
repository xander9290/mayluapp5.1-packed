import { Router } from "express";
import caja from "../controllers/Caja.controller.js";
const router = Router();

// get
router.get("/caja", caja.getCajas);

// create
router.post("/caja", caja.createCaja);

// delete
router.delete("/caja/:id", caja.deleteCaja);

// open cajon plugin
router.post("/caja/starcajonplugin", caja.startCajonPlugin);

export default router;
