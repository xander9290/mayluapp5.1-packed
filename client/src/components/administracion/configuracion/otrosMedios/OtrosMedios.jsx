import { useState, useRef } from "react";
import { verifyExiste } from "../../../../assets/helpers";
import { appContext } from "../../../../context/MainContext";
import ModalAlert from "../../../ModalAlert";
import ModalConfirm from "../../../ModalConfirm";

const initialOtroMedio = {
  name: "",
};
function OtrosMedios() {
  const { otrosMedios, createMedio, deleteMedio } = appContext();

  const [otroMedio, setOtroMedio] = useState(initialOtroMedio);
  const [id, setId] = useState("");

  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalAlert, setModalAlert] = useState({ show: false, msg: "" });

  const inputRef = useRef();
  const handleOtroMedio = (e) => {
    setOtroMedio({ ...otroMedio, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verifyExiste(otrosMedios, otroMedio.name)) {
      setModalAlert({ show: true, msg: "nombre no disponible" });
      return null;
    }
    const res = createMedio(otroMedio);
    if (res) cancelar();
  };

  const targetDeleteOtro = (_id) => {
    setId(_id);
    setModalConfirm(true);
  };

  const cancelar = () => {
    setOtroMedio(initialOtroMedio);
    inputRef.current.focus();
  };

  const handleShow = () => {
    inputRef.current.focus();
  };
  const handleExited = () => {
    setOtroMedio(initialOtroMedio);
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">
            Otros Medios
            <span className="badge bg-primary ms-2">{otrosMedios.length}</span>
          </h5>
          <form onSubmit={handleSubmit} className="d-flex">
            <input
              className="form-control"
              type="text"
              name="name"
              ref={inputRef}
              value={otroMedio.name}
              onChange={handleOtroMedio}
              required
              placeholder="Nuevo medio"
              autoComplete="off"
            />
            <button
              className="btn btn-primary ms-1"
              title="Guardar"
              type="submit"
            >
              <i className="bi bi-plus-circle"></i>
            </button>
            <button
              onClick={cancelar}
              title="CANCELAR"
              className="btn btn-warning ms-1"
              type="reset"
            >
              <i className="bi bi-x-circle"></i>
            </button>
          </form>
        </div>
        <div
          style={{ height: "450px", overflowY: "auto" }}
          className="card-body"
        >
          <ul className="list-group text-dark">
            {otrosMedios.map((medio) => (
              <li
                key={medio._id}
                style={{ cursor: "default" }}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span className="text-uppercase">{medio.name}</span>
                <div>
                  <button
                    onClick={() => targetDeleteOtro(medio._id)}
                    title="ELIMINAR"
                    type="button"
                    className="btn btn-danger"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ModalConfirm
        action={() => deleteMedio(id)}
        show={modalConfirm}
        onHide={() => setModalConfirm(false)}
      />
      <ModalAlert
        show={modalAlert.show}
        onHide={() => setModalAlert({ show: false, msg: "" })}
        msg={modalAlert.msg}
      />
    </>
  );
}

export default OtrosMedios;
