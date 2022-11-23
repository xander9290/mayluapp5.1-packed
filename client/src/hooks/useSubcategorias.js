import { useEffect, useState } from "react";
import routes from "../assets/routes";

let url;
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:3100/subcategorias";
} else {
  url = "/subcategorias";
}

function useSubcategorias() {
  const [subcategorias, setSubcategorias] = useState([]);

  useEffect(() => {
    cargarSubcategorias();
  }, []);

  const cargarSubcategorias = async () => {
    const data = await routes.get(url);
    setSubcategorias(data);
  };

  const createSubcategoria = async (body) => {
    const data = await routes.post(url, body);
    const newSubcategorias = [data, ...subcategorias];
    setSubcategorias(newSubcategorias);
  };

  const updateSubcategoria = async (id, body) => {
    const data = await routes.put(url + "/" + id, body);
    const changedSubcategorias = subcategorias.map((subcategoria) => {
      if (subcategoria._id === id) {
        subcategoria = data;
      }
      return subcategoria;
    });
    setSubcategorias(changedSubcategorias);
  };

  const deleteSubcategoria = async (id) => {
    const data = await routes.delete(url + "/" + id);
    if (data) {
      const changedValues = subcategorias.filter(
        (subcategoria) => subcategoria._id !== id
      );
      setSubcategorias(changedValues);
    } else {
      console.error(data);
    }
  };
  return {
    subcategorias,
    createSubcategoria,
    updateSubcategoria,
    deleteSubcategoria,
  };
}

export default useSubcategorias;
