import { useState } from "react";
import { Modal } from "react-bootstrap";
import { appContext } from "../../context/MainContext";

function ModalObservaciones({ show, onHide, cuenta }) {
  const { updateCuenta, session } = appContext();

  const [obs, setObs] = useState("");
  const [oldObs, setOldObs] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (obs === "") return;
    let newObs = "";
    if (oldObs === "") {
      newObs = `<${session.operador}: ${obs}>`;
    } else {
      newObs = `${cuenta.obs} <${session.operador}: ${obs}>`;
    }
    const newCuenta = {
      ...cuenta,
      obs: newObs,
    };
    await updateCuenta(cuenta._id, newCuenta);
    setOldObs(newObs);
    setObs("");
  };

  const cargarObservaciones = () => {
    setOldObs(cuenta.obs);
  };

  const handleshow = () => {
    cargarObservaciones();
  };

  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      onShow={handleshow}
      size="md"
    >
      <div className="card bg-white">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="card-title">Observaciones</h3>
          <p className="card-text fs-4 text-uppercase">orden: {cuenta.orden}</p>
          <button onClick={onHide} className="btn btn-danger" type="button">
            Cerrar
            <i className="bi bi-x-circle ms-2"></i>
          </button>
        </div>
        <div
          style={{ height: "150px", overflowY: "auto" }}
          className="card-body text-dark p-1"
        >
          <p className="card-text fs-5 fw-bold">{oldObs}</p>
        </div>
        <div className="card-footer">
          {cuenta.estado !== "cerrado" && (
            <form onSubmit={handleSubmit} className="d-flex">
              <input
                type="text"
                className="form-control form-control-lg fw-bold"
                name="obs"
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                rows="1"
                placeholder="Observación"
                required
                autoComplete="off"
                autoFocus
              />
              <button className="btn btn-primary btn-lg" type="submit">
                <i className="bi bi-plus-circle"></i>
              </button>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ModalObservaciones;
