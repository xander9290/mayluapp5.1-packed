import app from "./app.js";
import http from "http";
import open from "open";
import "./database.js";
import { Server as SocketServer } from "socket.io";

const server = http.createServer(app);

const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const tempId = {};
io.on("connection", (socket) => {
  socket.on("newCuenta", (newCuenta) => {
    socket.broadcast.emit("newCuenta", newCuenta);
  });

  socket.on("updatedCuenta", (changedCuenta) => {
    socket.broadcast.emit("updatedCuenta", changedCuenta);
  });

  socket.on("cuentaBloqueada", (cuentaId) => {
    tempId[socket.id] = cuentaId;
    socket.broadcast.emit("cuentaBloqueada", cuentaId);
  });

  socket.on("cuentaDesbloquear", (cuentaId) => {
    socket.broadcast.emit("cuentaDesbloquear", cuentaId);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("cuentaDesbloquear", tempId[socket.id]);
  });
});

server.listen(app.get("port"), () => {
  console.log("Servidor iniciado en puerto ", app.get("port"));
});

(async () => {
  console.log("Iniciando aplicación");
  await open(`http://localhost:${app.get("port")}`);
})();
