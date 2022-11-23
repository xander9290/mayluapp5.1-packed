import { useEffect, useState } from "react";
import { formatearFecha } from "../../assets/helpers";
import { appContext } from "../../context/MainContext";
import ModalConfirm from "../ModalConfirm";

function Clock() {
  const { session, setSession, createActividad } = appContext();
  const [modalConfirm, setModalConfirm] = useState(false);
  const [clock, setClock] = useState("00:00 --");

  const logout = async () => {
    await createActividad(
      session.operador,
      session.operador + " ha terminado la sesión",
      "system"
    );
    setSession({
      login: false,
      operador: null,
      rol: null,
    });
    document.title = "Maylu App5.1";
  };

  useEffect(() => {
    setInterval(() => {
      setClock(formatearFecha(new Date()).hora);
    }, 1000);
  }, []);
  return (
    <>
      <div className="bg-dark p-2 rounded fs-5 text-uppercase user-select-none">
        <span className="p-2 border-end">{session.operador}</span>
        <span className="p-2">{clock}</span>
        <span
          onClick={() => setModalConfirm(true)}
          role="button"
          className="text-danger p-2 border-start"
        >
          <small>Salir</small>
        </span>
      </div>
      <ModalConfirm
        show={modalConfirm}
        onHide={() => setModalConfirm(false)}
        action={logout}
      />
    </>
  );
}

export default Clock;
