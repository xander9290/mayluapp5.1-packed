import { Router } from "express";
import cliente from "../controllers/Clientes.controller.js";
const router = Router();

// get
router.get("/clientes", cliente.getClientes);

// create
router.post("/clientes", cliente.createCliente);

// update
router.put("/clientes/:id", cliente.updateCliente);

// delete
router.delete("/clientes/:id", cliente.deleteCliente);

export default router;
