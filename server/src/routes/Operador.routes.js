import { Router } from "express";
import operador from "../controllers/Operador.controller.js";
import actividad from "../controllers/Actividad.controller.js";
const router = Router();

// get
router.get("/operadores", operador.getOperadores);

// create
router.post("/operadores", operador.createOperador);

// login
router.post("/operadores/login", operador.loginOperador);

// autorizar
router.post("/operadores/autorizar", operador.autorizar);

// update
router.put("/operadores/:id", operador.updateOperador);

// delete
router.delete("/operadores/:id", operador.deleteOperador);

// ACTIVIDAD
// get
router.get("/operadores/actividad/:operador/:fecha", actividad.getActividad);

// create
router.post("/operadores/actividad", actividad.createActividad);

// exit
router.post("/operadores/exit", operador.exitProcess);

export default router;
