import { useState, useEffect } from "react";
import { appContext } from "../../context/MainContext";
import ModalAlert from "../ModalAlert";
import BtnAbrir from "./botones/BtnAbrir";
import BtnCancelar from "./botones/BtnCancelar";
import BtnImprimir from "./botones/BtnImprimir";
import BtnOpciones from "./botones/BtnOpciones";
import BtnReabrir from "./botones/BtnReabrir";
import styles from "./Main.module.css";
import ModalCaptura from "./ModalCaptura";
import ModalDetalle from "./ModalDetalle";
import ModalInfoDomicilio from "./ModalInfoDomicilio";
import ModalObservaciones from "./ModalObservaciones";
import ModalAsignarRepartidor from "./pago/ModalAsignarRepartidor";
import ModalPagar from "./pago/ModalPagar";
import ModalComedor from "./servicios/ModalComedor";
import ModalDomicilio from "./servicios/ModalDomicilio";
import ModalParaLLevar from "./servicios/ModalParaLLevar";
import TicketCliente from "./tickets/TicketCliente";
import TicketNegocio from "./tickets/TicketNegocio";

function BotoneraLateral() {
  const { cuenta, updateCuenta, reiniciarCuenta, createActividad, session } =
    appContext();

  const [modalComedor, setModalComedor] = useState(false);
  const [modalParallevar, setModalParallevar] = useState(false);
  const [modalDomicilio, setModalDomicilio] = useState(false);

  const [modalCaptura, setModalCaptura] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);

  const [modalTicketNegocio, setModalTicketNegocio] = useState(false);
  const [modalTicketCliente, setModalTicketCliente] = useState(false);

  const [modalPagar, setModalPagar] = useState(false);
  const [modalAsignarRepartidor, setModalAsignarRepartidor] = useState(false);

  const [modalInfoDomicilio, setModalInfoDomicilio] = useState(false);
  const [modalObservaciones, setModalObservaciones] = useState(false);

  const [modalAlert, setModalAlert] = useState({ show: false, msg: "" });

  const [isOpenDetalle, setIsOpenDetalle] = useState(false);

  useEffect(() => {
    if (cuenta._id) {
      if (cuenta.items.length === 0) return;
      if (cuenta.impreso) return;
      if (cuenta.estado !== "abierto") return;
      setTimeout(() => {
        setModalDetalle(true);
      }, 150);
    }
  }, [cuenta]);

  const targetModalComedor = () => {
    reiniciarCuenta();
    setModalComedor(true);
  };

  const targetModalParallevar = () => {
    reiniciarCuenta();
    setModalParallevar(true);
  };

  const targetModalDomicilio = () => {
    reiniciarCuenta();
    setModalDomicilio(true);
  };

  // Pago
  const targetPagarCuenta = () => {
    if (session.rol !== "master" && session.rol !== "cajero") {
      setModalAlert({
        show: true,
        msg: "operador no autorizado",
      });
      return;
    }
    if (cuenta.servicio === "domicilio") {
      if (cuenta.estado === "pendiente") {
        setModalPagar(true);
      } else {
        setModalAsignarRepartidor(true);
      }
    } else {
      setModalPagar(true);
    }
  };

  const targetModalCaptura = () => {
    setModalCaptura(true);
  };

  const targetModalDetalle = () => {
    if (cuenta._id) {
      setModalDetalle(true);
      setIsOpenDetalle(true);
    }
  };

  // tickets
  const targetModalTicketNegocio = () => {
    setModalTicketNegocio(true);
  };

  const targetModalTicketCliente = () => {
    setModalTicketCliente(true);
  };

  // boton opciones
  const targetModalInfoDomicilio = () => {
    setModalInfoDomicilio(true);
  };

  const targetOModalObservaciones = () => {
    setModalObservaciones(true);
  };

  const targetCambiarCliente = () => {
    if (session.rol !== "master" && session.rol !== "cajero") {
      setModalAlert({
        show: true,
        msg: "operador no autorizado",
      });
      return;
    }

    if (cuenta.servicio === "comedor") setModalComedor(true);
    if (cuenta.servicio === "pll") setModalParallevar(true);
    if (cuenta.servicio === "domicilio") setModalDomicilio(true);
  };

  const targetModalAsignarRepartidor = () => {
    if (session.rol !== "master" && session.rol !== "cajero") {
      setModalAlert({
        show: true,
        msg: "operador no autorizado",
      });
      return;
    }
    setModalAsignarRepartidor(true);
  };

  const targetReabrir = async () => {
    if (session.rol !== "master" && session.rol !== "cajero") {
      setModalAlert({
        show: true,
        msg: "operador no autorizado",
      });
      return;
    }
    const newCta = {
      ...cuenta,
      estado: "abierto",
      repartidor: "",
      impreso: false,
      time: "",
    };
    const res = await updateCuenta(cuenta._id, newCta);
    if (res) {
      await createActividad(
        session.operador,
        `${session.operador} ha reabiearto la orden ${cuenta.orden}`,
        "system"
      );
    }
  };
  return (
    <>
      <nav className={`nav flex-column p-1 ${styles.botoneraLateral}`}>
        <BtnAbrir
          targetModalComedor={targetModalComedor}
          targetModalParallevar={targetModalParallevar}
          targetModalDomicilio={targetModalDomicilio}
        />
        <button
          disabled={cuenta._id && !cuenta.impreso ? false : true}
          onClick={targetModalCaptura}
          type="button"
          className="btn btn-success text-uppercase btn-lg fw-bold text-dark py-3 fs-5 mt-1"
        >
          <i className="bi bi-hand-index-thumb me-2"></i>
          captura
        </button>
        <button
          disabled={cuenta._id ? false : true}
          onClick={targetModalDetalle}
          type="button"
          className="btn btn-success text-uppercase btn-lg fw-bold text-dark py-3 fs-4 mt-1"
        >
          <i className="bi bi-table me-2"></i>
          detalle
        </button>
        <BtnImprimir
          cuenta={cuenta}
          targetModalTicketNegocio={targetModalTicketNegocio}
          targetModalTicketCliente={targetModalTicketCliente}
        />
        <button
          onClick={targetPagarCuenta}
          disabled={cuenta.impreso ? false : true}
          type="button"
          className="btn btn-success text-uppercase btn-lg fw-bold text-dark py-3 fs-4 mt-1"
        >
          <i className="bi bi-cash-coin me-2"></i>pagar
        </button>
        <BtnOpciones
          cuenta={cuenta}
          targetModalInfoDomicilio={targetModalInfoDomicilio}
          targetCambiarCliente={targetCambiarCliente}
          targetModalAsignarRepartidor={targetModalAsignarRepartidor}
          targetOModalObservaciones={targetOModalObservaciones}
        />
        <BtnReabrir targetReabrir={targetReabrir} />
        <BtnCancelar cuenta={cuenta} updateCuenta={updateCuenta} />
      </nav>
      <ModalComedor
        show={modalComedor}
        onHide={() => setModalComedor(false)}
        targetModalCaptura={targetModalCaptura}
      />
      <ModalParaLLevar
        show={modalParallevar}
        onHide={() => setModalParallevar(false)}
        targetModalCaptura={targetModalCaptura}
      />
      <ModalDomicilio
        show={modalDomicilio}
        onHide={() => setModalDomicilio(false)}
        targetModalCaptura={targetModalCaptura}
      />
      <ModalCaptura
        show={modalCaptura}
        onHide={() => setModalCaptura(false)}
        isOpenDetalle={isOpenDetalle}
      />
      <ModalDetalle
        show={modalDetalle}
        onHide={() => setModalDetalle(false)}
        modalCaptura={targetModalCaptura}
        reabrir={targetReabrir}
        targetModalTicketNegocio={targetModalTicketNegocio}
        targetPagarCuenta={targetPagarCuenta}
        setIsOpenDetalle={setIsOpenDetalle}
      />
      <TicketNegocio
        show={modalTicketNegocio}
        onHide={() => setModalTicketNegocio(false)}
        cuenta={cuenta}
      />
      <TicketCliente
        show={modalTicketCliente}
        onHide={() => setModalTicketCliente(false)}
        cuenta={cuenta}
      />
      <ModalPagar
        show={modalPagar}
        onHide={() => setModalPagar(false)}
        targetModalTicketCliente={targetModalTicketCliente}
        closeDetalle={() => setModalDetalle(false)}
      />
      <ModalAsignarRepartidor
        show={modalAsignarRepartidor}
        onHide={() => setModalAsignarRepartidor(false)}
        targetModalTicketCliente={targetModalTicketCliente}
      />
      <ModalInfoDomicilio
        show={modalInfoDomicilio}
        onHide={() => setModalInfoDomicilio(false)}
      />
      <ModalObservaciones
        show={modalObservaciones}
        onHide={() => setModalObservaciones(false)}
        cuenta={cuenta}
      />
      <ModalAlert
        show={modalAlert.show}
        onHide={() => setModalAlert({ show: false, msg: "" })}
        msg={modalAlert.msg}
      />
    </>
  );
}

export default BotoneraLateral;
