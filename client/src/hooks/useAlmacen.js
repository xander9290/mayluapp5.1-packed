import { useState, useEffect } from "react";
import routes from "../assets/routes";

let url;
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:3100/almacenes";
} else {
  url = "/almacenes";
}

function useAlmacen() {
  const [almacenes, setAlmacenes] = useState([]);

  useEffect(() => {
    cargarAlmacenes();
  }, []);

  const cargarAlmacenes = async () => {
    const data = await routes.get(url);
    setAlmacenes(data.data);
  };

  const createAlmacen = async (body) => {
    const data = await routes.post(url, body);
    const newAlmacenes = [data, ...almacenes];
    setAlmacenes(newAlmacenes);
  };

  const updateAlmacen = async (id, body) => {
    const data = await routes.put(url + "/" + id, body);
    const changedAlmacenes = almacenes.map((almacen) => {
      if (almacen._id === id) {
        almacen = data;
      }
      return almacen;
    });
    setAlmacenes(changedAlmacenes);
  };

  const deleteAlmacen = async (id) => {
    const data = await routes.delete(url + "/" + id);
    if (data) {
      const changedValues = almacenes.filter((almacen) => almacen._id !== id);
      setAlmacenes(changedValues);
    } else {
      console.error(data);
    }
  };

  return { almacenes, createAlmacen, updateAlmacen, deleteAlmacen };
}

export default useAlmacen;
