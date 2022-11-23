import { useState } from "react";
import { appContext } from "../../../context/MainContext";
import { formatearFecha, verifyExiste } from "../../../assets/helpers";
import ModalConfirm from "../../ModalConfirm";

const initOperador = {
  name: "",
  pswd: "",
  rol: "",
};
function OperadorForm() {
  const {
    operadores,
    createOperador,
    updateOperador,
    deleteOperador,
    session,
  } = appContext();
  const [operador, setOperador] = useState(initOperador);
  const [idx, setIdx] = useState("");
  const [modalConfirm, setModalConfirm] = useState(false);

  const handleOperador = (e) => {
    setOperador({ ...operador, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (operador._id) {
      const newOper = {
        ...operador,
        lastEdit: Date.now(),
      };
      const res = await updateOperador(operador._id, newOper);
      if (res) {
        cancelar();
      }
    } else {
      const newOper = {
        ...operador,
        createdBy: session.operador ? session.operador : "system",
      };
      if (verifyExiste(operadores, operador.name)) {
        alert(
          `!ERROR!\nEl valor "${operador.name}" para este operador no esta disponible.`
        );
        return;
      }
      createOperador(newOper);
      cancelar();
    }
  };

  const selectOperador = (id) => {
    const findOperador = operadores.find((operador) => operador._id === id);
    if (findOperador) setOperador(findOperador);
  };

  const cancelar = () => {
    setOperador(initOperador);
    setIdx("");
  };

  const targets = (e) => {
    e.stopPropagation();
    setIdx("");
  };
  return (
    <div className="card">
      <div className="card-header">
        <form onSubmit={handleSubmit} className="d-flex">
          <input
            className="form-control"
            type="text"
            name="name"
            maxLength="15"
            value={operador.name}
            onChange={handleOperador}
            autoComplete="off"
            placeholder="Nombre"
            required
          />
          <input
            className="form-control"
            type="password"
            name="pswd"
            maxLength="4"
            value={operador.pswd}
            onChange={handleOperador}
            autoComplete="off"
            required
            placeholder="Contraseña"
          />
          <select
            className="form-select"
            name="rol"
            value={operador.rol}
            onChange={handleOperador}
            required
          >
            <option value="">Rol</option>
            <option value="master">Master</option>
            <option value="cajero">Cajero</option>
            <option value="repartidor">Repartidor</option>
          </select>
          {operador._id ? (
            <button title="EDITAR" className="btn btn-primary" type="submit">
              <i className="bi bi-pencil"></i>
            </button>
          ) : (
            <button title="AGREGAR" className="btn btn-primary" type="submit">
              <i className="bi bi-plus-circle"></i>
            </button>
          )}
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
      <div onClick={targets} className="card-body card-body-admin">
        <table className="table table-bordered user-select-none bg-white text-dark">
          <thead>
            <tr className="text-center text-uppercase">
              <th scope="col">
                <i className="bi bi-trash"></i>
              </th>
              <th scope="col">
                <i className="bi bi-pencil"></i>
              </th>
              <th scope="col">Nombre</th>
              <th scope="col">Rol</th>
            </tr>
          </thead>
          <tbody>
            {operadores.map((operador) => (
              <tr
                key={operador._id}
                style={{ cursor: "default" }}
                onClick={(e) => {
                  e.stopPropagation(), setIdx(operador._id);
                }}
                className={`text-uppercase ${
                  operador._id === idx ? "bg-info" : ""
                }`}
              >
                <th scope="row" className="text-center">
                  <button
                    onClick={() => setModalConfirm(true)}
                    title="ELIMINAR"
                    type="button"
                    className="btn btn-danger"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </th>
                <th scope="row" className="text-center">
                  <button
                    onClick={() => selectOperador(operador._id)}
                    title="EDITAR"
                    type="button"
                    className="btn btn-primary"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </th>
                <td valign="middle">{operador.name}</td>
                <td valign="middle" className="text-center">
                  {operador.rol}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-footer">
        <p className="p-0 m-0">
          <span className="fw-bolder">Creación: </span>
          <span>
            {operador.createdAt && formatearFecha(operador.createdAt).fechaHora}
          </span>
        </p>
        <p className="p-0 m-0">
          <span className="fw-bolder">Creado por: </span>
          <span>{operador.createdBy}</span>
        </p>
        <p className="p-0 m-0">
          <span className="fw-bolder">Última edición: </span>
          <span>
            {operador.lastEdit && formatearFecha(operador.lastEdit).fechaHora}
          </span>
        </p>
      </div>
      <ModalConfirm
        show={modalConfirm}
        onHide={() => setModalConfirm(false)}
        action={() => deleteOperador(idx)}
      />
    </div>
  );
}

export default OperadorForm;
