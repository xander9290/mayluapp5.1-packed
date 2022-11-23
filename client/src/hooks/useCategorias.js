import { useState, useEffect } from "react";
import routes from "../assets/routes";

let url;
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:3100/categorias";
} else {
  url = "/categorias";
}

function useCategorias() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    const data = await routes.get(url);
    setCategorias(data);
  };

  const createCategoria = async (body) => {
    const data = await routes.post(url, body);
    const newCategorias = [data, ...categorias];
    setCategorias(newCategorias);
  };

  const updateCategoria = async (id, body) => {
    const data = await routes.put(url + "/" + id, body);
    const changedCategorias = categorias.map((categoria) => {
      if (categoria._id === id) {
        categoria = data;
      }
      return categoria;
    });
    setCategorias(changedCategorias);
  };

  const deleteCategoria = async (id) => {
    const data = await routes.delete(url + "/" + id);
    if (data) {
      const changedValues = categorias.filter(
        (categoria) => categoria._id !== id
      );
      setCategorias(changedValues);
    } else {
      console.error(data);
    }
  };

  return { categorias, createCategoria, updateCategoria, deleteCategoria };
}

export default useCategorias;
