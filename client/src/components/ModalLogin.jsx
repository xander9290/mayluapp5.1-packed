import { useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import { appContext } from "../context/MainContext";
import Operadores from "./administracion/operadores/Operadores";

const initialOperador = { name: "", pswd: "" };
function ModalLogin({ show, onHide }) {
  const { operadores, loginOperador, createActividad } = appContext();
  const pswdRef = useRef();

  const [operador, setOperador] = useState(initialOperador);
  const [idx, setIdx] = useState("");
  const [msg, setMsg] = useState(false);
  const [modalOperadores, setModalOperadores] = useState(false);

  const handleOperador = (e) => {
    setOperador({ ...operador, [e.target.name]: e.target.value });
    setMsg(false);
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    const res = await loginOperador(operador);
    if (res) {
      await createActividad(
        operador.name,
        `${operador.name} ha iniciado sesión`,
        "system"
      );
      document.title = `Maylu App5.1-${operador.name.toUpperCase()}`;
      onHide();
    } else {
      setMsg(true);
      pswdRef.current.select();
    }
  };

  const selectOperador = (id) => {
    const findOperador = operadores.find((operador) => operador._id === id);
    if (findOperador) setOperador({ ...findOperador, pswd: "" });
    pswdRef.current.focus();
    setMsg(false);
  };

  const targetModalOperadores = () => {
    setModalOperadores(true);
  };

  const handleShow = () => {};
  const handleExited = () => {
    setOperador(initialOperador);
    setIdx("");
  };

  const targets = (e) => {
    e.stopPropagation();
    setOperador(initialOperador);
    setIdx("");
    setMsg(false);
  };
  return (
    <>
      <Modal
        onHide={onHide}
        show={show}
        backdrop="static"
        keyboard={false}
        onShow={handleShow}
        onExited={handleExited}
        dialogClassName="modal-login"
        size="sm"
      >
        <div className="container-fluid">
          <Modal.Header className="row p-0">
            <div className="col-md-12 p-1 d-flex justify-content-between align-items-center">
              <h4>Iniciar sesión</h4>
              {operadores.length === 0 && (
                <a onClick={targetModalOperadores} href="#">
                  Nuevo
                </a>
              )}
            </div>
          </Modal.Header>
          <Modal.Body className="row p-0">
            <div className="col-md-12 p-0">
              <div className="card">
                <div
                  style={{ height: "244px", overflowY: "auto" }}
                  onClick={targets}
                  className="card-body p-2"
                >
                  <table className="table table-white table-bordered bg-white text-dark user-select-none text-uppercase">
                    <thead>
                      <tr className="text-center">
                        <th>Operador</th>
                        <th>Rol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {operadores.map((operador) => (
                        <tr
                          className={`cursor-pointer ${
                            operador._id === idx ? "bg-info fw-bold" : ""
                          }`}
                          key={operador._id}
                          onClick={(e) => {
                            e.stopPropagation(), setIdx(operador._id);
                          }}
                          onDoubleClick={() => selectOperador(operador._id)}
                        >
                          <td>
                            <button
                              onClick={() => selectOperador(operador._id)}
                              className="btn btn-primary btn-sm me-2"
                              title="Seleccionar"
                            >
                              <i className="bi bi-arrow-right-square"></i>
                            </button>
                            {operador.name}
                          </td>
                          <td>{operador.rol}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-footer p-2">
                  <form onSubmit={handleSubmitLogin}>
                    <div className="mb-2">
                      <input
                        className="form-control fw-bold"
                        type="text"
                        name="name"
                        value={operador.name}
                        onChange={handleOperador}
                        maxLength="15"
                        autoComplete="off"
                        required
                        placeholder="Operador"
                      />
                    </div>
                    <div className="mb-1">
                      <input
                        className="form-control"
                        type="password"
                        ref={pswdRef}
                        name="pswd"
                        value={operador.pswd}
                        onChange={handleOperador}
                        maxLength="4"
                        autoComplete="off"
                        required
                        placeholder="Contraseña"
                      />
                    </div>
                    <div className="mb-2 d-grid">
                      <button type="submit" className="btn btn-primary">
                        ENTRAR
                      </button>
                    </div>
                    {msg && (
                      <div className="bg-danger text-white fs-4 fw-bold border border-2 border-white text-uppercase text-center rounded">
                        acceso denegado
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </Modal.Body>
        </div>
      </Modal>
      <Operadores
        show={modalOperadores}
        onHide={() => setModalOperadores(false)}
      />
    </>
  );
}

export default ModalLogin;
