import { useState, useEffect } from "react";
import { formatearFecha } from "../assets/helpers";
import routes from "../assets/routes";

let url;
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:3100/operadores";
} else {
  url = "/operadores";
}
function useOperador() {
  const [operadores, setOperadores] = useState([]);
  const [session, setSession] = useState({
    login: false,
    operador: null,
    rol: null,
  });

  useEffect(() => {
    getOperadores();
  }, []);

  useEffect(() => {}, [operadores]);

  const getOperadores = async () => {
    const data = await routes.get(url);
    setOperadores(data);
  };

  const createOperador = async (body) => {
    const data = await routes.post(url, body);
    const newOperadores = [data, ...operadores];
    setOperadores(newOperadores);
  };

  const loginOperador = async (body) => {
    const data = await routes.post(url + "/login", body);
    if (data.login)
      setSession({
        login: data.login,
        operador: data.operador.name,
        rol: data.operador.rol,
      });
    return data.login;
  };

  const autorizacion = async (body) => {
    const data = await routes.post(url + "/autorizar", body);
    return data;
  };

  const exitProcess = async () => {
    await routes.post(url + "/exit");
  };

  const updateOperador = async (id, body) => {
    const data = await routes.put(url + "/" + id, body);
    const changedOperadores = operadores.map((operador) => {
      if (operador._id === id) {
        operador = data;
      }
      return operador;
    });
    setOperadores(changedOperadores);
    return true;
  };

  const deleteOperador = async (id) => {
    const data = await routes.delete(url + "/" + id);
    if (data) {
      const changedValues = operadores.filter(
        (operador) => operador._id !== id
      );
      setOperadores(changedValues);
      if (changedValues.length === 0) {
        setSession({
          login: false,
          operador: null,
          rol: null,
        });
      }
    }
  };

  // ACTIVIDAD
  const getActividad = async (params) => {
    const data = await routes.get(
      url + "/actividad/" + params.operador + "/" + params.fecha
    );
    return data;
  };

  const createActividad = async (operador, commit, auth) => {
    const body = {
      operador,
      commit,
      auth,
      fecha: formatearFecha(Date.now()).fecha,
    };
    const data = await routes.post(url + "/actividad", body);
    return data;
  };

  return {
    operadores,
    createOperador,
    loginOperador,
    updateOperador,
    deleteOperador,
    session,
    setSession,
    autorizacion,
    createActividad,
    getActividad,
    exitProcess,
  };
}

export default useOperador;
