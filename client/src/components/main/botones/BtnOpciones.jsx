import { useState } from "react";
import ModalAlert from "../../ModalAlert";

function BtnOpciones({
  cuenta,
  targetModalInfoDomicilio,
  targetCambiarCliente,
  targetModalAsignarRepartidor,
  targetOModalObservaciones,
}) {
  const [modalAlert, setModalAlert] = useState({ show: false, msg: "" });

  const targetCambiarRepartidor = () => {
    if (cuenta.repartidor === "") {
      setModalAlert({
        show: true,
        msg: "la orden aún no cuenta con repartidor asignado",
      });
      return;
    }
    targetModalAsignarRepartidor();
  };
  return (
    <>
      <div className="btn-group dropstart">
        <button
          disabled={cuenta._id ? false : true}
          type="button"
          className="btn btn-success dropdown-toggle text-uppercase btn-lg fw-bold text-dark py-3 fs-4 mt-1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Opciones
        </button>
        <div className="dropdown-menu text-uppercase">
          <a
            onClick={targetModalInfoDomicilio}
            href="#"
            className="dropdown-item fs-4 py-2"
          >
            ver domicilio
          </a>
          <a
            onClick={targetCambiarCliente}
            href="#"
            className="dropdown-item fs-4 py-2"
          >
            cambiar cliente
          </a>
          <a
            onClick={targetCambiarCliente}
            href="#"
            className="dropdown-item fs-4 py-2"
          >
            editar torreta
          </a>
          <a
            onClick={targetCambiarRepartidor}
            href="#"
            className="dropdown-item fs-4 py-2"
          >
            cambiar repartidor
          </a>
          <a
            onClick={targetOModalObservaciones}
            href="#"
            className="dropdown-item fs-4 py-2"
          >
            observaciones
          </a>
        </div>
      </div>
      <ModalAlert
        show={modalAlert.show}
        onHide={() => setModalAlert({ show: false, msg: "" })}
        msg={modalAlert.msg}
      />
    </>
  );
}

export default BtnOpciones;
