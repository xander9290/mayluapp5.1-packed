import { Router } from "express";
import cuenta from "../controllers/Cuenta.controller.js";
const router = Router();

// get cuentas Abiertas
router.get("/cuentas/activas", cuenta.getCuentasAbiertas);
// get cuentas por fechas
router.get("/cuentas/porfechas/:gte/:lte", cuenta.getCuentaPorFecha);
// get cuentas por historial
router.get("/cuentas/historial/:fecha", cuenta.getCuentaHistorial);
// get cuentas cliente historial
router.get("/cuentas/cliente/:clienteId", cuenta.getCuentaClienteHistorial);
// get items
router.get("/cuentas/:gte/:lte/items", cuenta.getItems);

// create Cuenta
router.post("/cuentas", cuenta.createCuenta);

// update
router.put("/cuentas/:id", cuenta.updateCuenta);

export default router;
