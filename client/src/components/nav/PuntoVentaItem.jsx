import { useState } from "react";
import { appContext } from "../../context/MainContext";
import ModalAlert from "../ModalAlert";
import ModalAuth from "../ModalAuth";
import ModalCaja from "../puntoventa/caja/ModalCaja";
import ModalCuentasCerradas from "../puntoventa/ModalCuentasCerradas";
import ModalMonitor from "../puntoventa/monitor/ModalMonitor";
import BtnAbrirCajon from "./BtnAbrirCajon";

function PuntoVentaItem() {
  const { abrirCajon } = appContext();
  const { createActividad, session } = appContext();

  const [modalCuentasCerradas, setModalCuentasCerradas] = useState(false);
  const [modalCaja, setModalCaja] = useState(false);
  const [modalMonitor, setModalMonitor] = useState(false);

  const [modalAuth, setModalAuth] = useState(false);
  const [modalAlert, setModalAlert] = useState({ show: false, msg: "" });

  const targetModalCuentasCerradas = () => {
    if (session.rol !== "master" && session.rol !== "cajero") {
      setModalAlert({ show: true, msg: "operador no autorizado" });
      return;
    }
    setModalCuentasCerradas(true);
  };

  const targetModalRetiros = () => {
    if (session.rol !== "master" && session.rol !== "cajero") {
      setModalAlert({ show: true, msg: "operador no autorizado" });
      return;
    }
    setModalCaja(true);
  };

  const targetMonitorVentas = async (master) => {
    setModalMonitor(true);
    await createActividad(
      session.operador,
      `${session.operador} ha consultado el monitor de ventas`,
      master
    );
  };

  const targetAbrirCajon = async () => {
    await abrirCajon();
  };

  return (
    <>
      <li className="nav-item dropdown">
        <a
          href="#"
          className="nav-link dropdown-toggle fs-5 text-dark"
          data-bs-toggle="dropdown"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Punto de Venta
        </a>
        <div className="dropdown-menu">
          <BtnAbrirCajon targetAbrirCajon={targetAbrirCajon} />
          <a
            onClick={targetModalCuentasCerradas}
            href="#"
            className="dropdown-item fs-5 py-2"
          >
            Cuentas cerradas
          </a>
          <a
            onClick={targetModalRetiros}
            href="#"
            className="dropdown-item fs-5 py-2"
          >
            Retiros y depósitos
          </a>
          <div className="dropdown-divider"></div>
          <a
            onClick={() => setModalAuth(true)}
            href="#"
            className="dropdown-item fs-5"
          >
            Monitor de ventas
          </a>
        </div>
      </li>
      <ModalCuentasCerradas
        show={modalCuentasCerradas}
        onHide={() => setModalCuentasCerradas(false)}
      />
      <ModalCaja show={modalCaja} onHide={() => setModalCaja(false)} />
      <ModalAuth
        show={modalAuth}
        onHide={() => setModalAuth(false)}
        action={targetMonitorVentas}
      />
      <ModalAlert
        show={modalAlert.show}
        onHide={() => setModalAlert({ show: false, msg: "" })}
        msg={modalAlert.msg}
      />
      <ModalMonitor show={modalMonitor} onHide={() => setModalMonitor(false)} />
    </>
  );
}

export default PuntoVentaItem;
