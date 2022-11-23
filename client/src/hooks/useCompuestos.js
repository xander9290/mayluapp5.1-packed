import { useEffect, useState } from "react";
import routes from "../assets/routes";

let url;
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:3100/compuestos";
} else {
  url = "/compuestos";
}

function useCompuestos() {
  const [compuestos, setCompuestos] = useState([]);

  useEffect(() => {
    cargarCompuestos();
  }, []);

  const cargarCompuestos = async () => {
    const data = await routes.get(url);
    setCompuestos(data.data);
  };

  const createCompuesto = async (body) => {
    const data = await routes.post(url, body);
    const newCompuestos = [data, ...compuestos];
    setCompuestos(newCompuestos);
  };

  const updateCompuesto = async (id, body) => {
    const data = await routes.put(url + "/" + id, body);
    const changedCompuestos = compuestos.map((compuesto) => {
      if (compuesto._id === id) {
        compuesto = data;
      }
      return compuesto;
    });
    setCompuestos(changedCompuestos);
  };

  const deleteCompuesto = async (id) => {
    const data = await routes.delete(url + "/" + id);
    if (data) {
      const changedValues = compuestos.filter(
        (compuesto) => compuesto._id !== id
      );
      setCompuestos(changedValues);
    }
  };

  const procesarCompuestos = (producto, cantidad) => {
    const updatedCompuestos = producto.compuestos.map((currentCompuesto) => {
      compuestos.map((compuesto) => {
        if (currentCompuesto._id === compuesto._id) {
          currentCompuesto.cantidad = compuesto.cantidad * cantidad;
          currentCompuesto.price = compuesto.price * cantidad;
        }
        return compuesto;
      });
      return currentCompuesto;
    });

    return updatedCompuestos;
  };

  return {
    compuestos,
    createCompuesto,
    updateCompuesto,
    deleteCompuesto,
    procesarCompuestos,
  };
}

export default useCompuestos;
