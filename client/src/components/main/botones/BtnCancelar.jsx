import { useState } from "react";
import ModalAuth from "../../ModalAuth";
import ModalCancelarCuenta from "../ModalCancelarCuenta";

const BtnCancelar = ({ cuenta }) => {
  const { _id, impreso } = cuenta;
  const disabled = _id && impreso;
  const [modalAuth, setModalAuth] = useState(false);
  const [modalCancelar, setModalCancelar] = useState({
    show: false,
    master: "",
  });

  const targetModalAuth = () => {
    setModalAuth(true);
  };

  const targetCancelarCueta = (master) => {
    setModalCancelar({ show: true, master });
  };

  return (
    <>
      <button
        onClick={targetModalAuth}
        disabled={!disabled}
        type="button"
        className="btn btn-success text-uppercase btn-lg fw-bold text-dark py-3 fs-5 mt-1"
      >
        <i className="bi bi-x-square me-1"></i>Cancelar
      </button>
      <ModalAuth
        action={targetCancelarCueta}
        show={modalAuth}
        onHide={() => setModalAuth(false)}
      />
      <ModalCancelarCuenta
        show={modalCancelar.show}
        master={modalCancelar.master}
        onHide={() => setModalCancelar({ show: false, master: "" })}
      />
    </>
  );
};

export default BtnCancelar;
