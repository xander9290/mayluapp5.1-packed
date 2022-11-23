import { useEffect, useState } from "react";
import routes from "../assets/routes";

let url;
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:3100/productos";
} else {
  url = "/productos";
}

function useProductos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const data = await routes.get(url);
    setProductos(data);
  };

  const createProducto = async (body) => {
    const data = await routes.post(url, body);
    const newProductos = [data, ...productos];
    setProductos(newProductos);
  };

  const updateProducto = async (id, body) => {
    const data = await routes.put(url + "/" + id, body);
    const changedProductos = productos.map((producto) => {
      if (producto._id === id) {
        producto = data;
      }
      return producto;
    });
    setProductos(changedProductos);
  };

  const deleteProducto = async (id) => {
    const data = await routes.delete(url + "/" + id);
    if (data) {
      const changedValues = productos.filter((producto) => producto._id !== id);
      setProductos(changedValues);
    }
  };

  return { productos, createProducto, updateProducto, deleteProducto };
}

export default useProductos;
