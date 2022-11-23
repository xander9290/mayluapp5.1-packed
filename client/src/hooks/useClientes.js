import { useState, useEffect } from "react";
import routes from "../assets/routes";

let url;
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:3100/clientes";
} else {
  url = "/clientes";
}

function useClientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    const data = await routes.get(url);
    setClientes(data);
  };

  const createCliente = async (body) => {
    const data = await routes.post(url, body);
    const newClientes = [data, ...clientes];
    setClientes(newClientes);

    return data;
  };

  const updateCliente = async (id, body) => {
    const data = await routes.put(url + "/" + id, body);
    const changedClientes = clientes.map((cliente) => {
      if (cliente._id === id) {
        cliente = data;
      }
      return cliente;
    });
    setClientes(changedClientes);
  };

  const deleteCliente = async (id) => {
    const data = await routes.delete(url + "/" + id);
    if (data) {
      const changedValues = clientes.filter((cliente) => cliente._id !== id);
      setClientes(changedValues);
    }
  };

  return { clientes, createCliente, updateCliente, deleteCliente };
}

export default useClientes;
