import path from "path";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes/index.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const app = express();

// Settings
app.set("port", 3100);

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(routes.categorias);
app.use(routes.subcategorias);
app.use(routes.productos);
app.use(routes.clientes);
app.use(routes.operadores);
app.use(routes.cuentas);
app.use(routes.cajas);
app.use(routes.almacenes);
app.use(routes.compuestos);
app.use(routes.entradas);

// Static Files
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(__dirname, "../../client/dist")));

export default app;
