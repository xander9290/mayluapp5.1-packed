import { Router } from "express";
import compuesto from "../controllers/Compuesto.controller.js";
const router = Router();

// get
router.get("/compuestos", compuesto.getCompuestos);

// create
router.post("/compuestos", compuesto.createCompuesto);

// update
router.put("/compuestos/:id", compuesto.updateCompuesto);

// delete
router.delete("/compuestos/:id", compuesto.deleteCompuesto);

export default router;
