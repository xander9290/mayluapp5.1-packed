import { useState } from "react";
import { Modal } from "react-bootstrap";
import { lifeTime } from "../../assets/helpers";
import { appContext } from "../../context/MainContext";

function ModalCancelarCuenta({ master, show, onHide }) {
  const { cuenta, updateCuenta, reiniciarCuenta, createActividad, session } =
    appContext();
  const [motivo, setMotivo] = useState("");

  const handleMotivo = (e) => setMotivo(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (motivo === "") setMotivo("sin especificar");
    const newCuenta = {
      ...cuenta,
      estado: "cancelado",
      motivoCancelado: motivo,
      closedAt: Date.now(),
      time: lifeTime(new Date(cuenta.createdAt)),
    };
    const res = await updateCuenta(cuenta._id, newCuenta);
    if (res) {
      reiniciarCuenta();
      await createActividad(
        session.operador,
        `${session.operador} ha cancelado la orden ${cuenta.orden}`,
        master
      );
      onHide();
    }
  };

  return (
    <Modal
      onHide={onHide}
      show={show}
      onShow={() => setMotivo("")}
      backdrop="static"
      keyboard={false}
      dialogClassName=""
      size="sm"
    >
      <form onSubmit={handleSubmit} className="card bg-success">
        <div className="card-header">
          <h5 className="card-title text-center">Motivo de la cancelación</h5>
        </div>
        <div className="card-body p-1">
          <input
            className="form-control"
            type="text"
            value={motivo}
            onChange={handleMotivo}
            name="motivo"
            placeholder="Motivo"
            autoComplete="off"
            required
            autoFocus
          />
        </div>
        <div className="card-footer p-2 text-end">
          <button
            onClick={onHide}
            className="btn btn-light text-dark"
            type="reset"
          >
            Cancelar
          </button>
          <button className="btn btn-primary ms-2" type="submit">
            Aceptar
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalCancelarCuenta;
