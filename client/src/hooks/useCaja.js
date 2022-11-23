import { useEffect, useState } from "react";
import routes from "../assets/routes";

let url;
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:3100/caja";
} else {
  url = "/caja";
}
const puerto = "8080";
const nombreImpresora = "maylu_printer";
function useCaja() {
  const [cajas, setCajas] = useState([]);

  useEffect(() => {
    cargarCajas();
    startCajonPlugin();
  }, []);

  const cargarCajas = async () => {
    const data = await routes.get(url);
    setCajas(data);
  };

  const createCaja = async (body) => {
    const data = await routes.post(url, body);
    const newCajas = [data, ...cajas];
    setCajas(newCajas);

    return { res: true, data };
  };

  const deleteCaja = async (id) => {
    const data = await routes.delete(url + "/" + id);
    if (data) {
      const changedValues = cajas.filter((caja) => caja._id !== id);
      setCajas(changedValues);
    }
  };

  const startCajonPlugin = async () => {
    await routes.post(url + "/starcajonplugin");
  };

  const abrirCajon = async () => {
    const respuesta = await fetch(
      `http://localhost:${puerto}/?impresora=${nombreImpresora}`
    );
    const respuestaDecodificada = await respuesta.json();
    if (respuesta.status === 200) {
      console.log("Cajón abierto");
    } else {
      console.log("Error abriendo: " + respuestaDecodificada);
    }
  };
  return { cajas, createCaja, deleteCaja, abrirCajon };
}

export default useCaja;
