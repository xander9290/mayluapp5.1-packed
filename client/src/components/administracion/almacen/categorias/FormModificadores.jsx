import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { formatearFecha, verifyExiste } from "../../../../assets/helpers";
import { appContext } from "../../../../context/MainContext";
import ModalAlert from "../../../ModalAlert";
import ModalConfirm from "../../../ModalConfirm";

const initialModificador = {
  name: "",
  price: 0,
  createdAt: Date.now(),
  lastEdit: "",
  id: null,
  tipo: "",
  compuestoId: "",
};

function FormModificadores({
  modificadores,
  setModificadores,
  selectedSubcategoria,
}) {
  const { compuestos, session } = appContext();

  const [modificador, setModificador] = useState(initialModificador);
  const [idx, setIdx] = useState("");

  const [modalAlert, setModalAlert] = useState({ show: false, msg: "" });
  const [modalConfirm, setModalConfirm] = useState(false);

  useEffect(() => {
    if (modificadores.length === 0) cancelar();
  }, [modificadores]);

  const handleModificador = (e) => {
    setModificador({ ...modificador, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modificador.id) {
      const newMod = {
        ...modificador,
        price: parseInt(modificador.price),
        lastEdit: Date.now(),
      };
      const findIndex = modificadores.findIndex(
        (mod) => mod.id === modificador.id
      );
      const list = modificadores;
      list[findIndex] = newMod;
      setModificadores([...list]);
      cancelar();
    } else {
      const newMod = {
        ...modificador,
        id: uuidv4(),
        createdBy: session.operador,
      };
      if (verifyExiste(modificadores, modificador.name)) {
        setModalAlert({
          show: true,
          msg: `El valor "${modificador.name}" para este modificador no esta disponible`,
        });
        return;
      }
      setModificadores([...modificadores, newMod]);
      cancelar();
    }
  };

  const selectModificador = (id) => {
    const findModificador = modificadores.find(
      (modificador) => modificador.id === id
    );
    setModificador(findModificador);
  };

  const deleteModificador = (id) => {
    const newList = [];
    const changedValues = modificadores.filter(
      (modificador) => modificador.id !== id
    );
    changedValues.map((m, i) => {
      newList.push({ ...m, id: i + 1 });
    });
    setModificadores(newList);
    cancelar();
  };

  const targetDeleteModificador = (id) => {
    setIdx(id);
    setModalConfirm(true);
  };

  const cancelar = () => {
    setModificador(initialModificador);
    setIdx("");
  };

  return (
    <>
      <div className="card">
        <div className="card-header p-1">
          <h5 className="card-title">
            Modificadores
            <span className="badge bg-primary ms-2 me-2">
              {modificadores.length}
            </span>
            {modificador.id && "<Modo Edición>"}
          </h5>
          <form onSubmit={handleSubmit}>
            <div style={{ pointerEvents: selectedSubcategoria }}>
              <div className="mb-1 d-flex">
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  value={modificador.name}
                  onChange={handleModificador}
                  autoComplete="off"
                  required
                  placeholder="Descripción"
                />
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    className="form-control"
                    type="number"
                    name="price"
                    min="0"
                    value={modificador.price}
                    onChange={handleModificador}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="mb-1 d-flex">
                <select
                  className="form-select text-uppercase"
                  name="tipo"
                  value={modificador.tipo}
                  onChange={handleModificador}
                  required
                >
                  <option value="">Tipo</option>
                  <option value="con">con</option>
                  <option value="sin">sin</option>
                </select>
                <select
                  className="form-select text-uppercase"
                  name="compuestoId"
                  value={modificador.compuestoId}
                  onChange={handleModificador}
                >
                  <option value="">Compuesto</option>
                  {compuestos.map((compuesto) => (
                    <option
                      className="fs-5"
                      key={compuesto._id}
                      value={compuesto._id}
                    >
                      {compuesto.name}
                    </option>
                  ))}
                </select>
              </div>
              {modificador.id !== null ? (
                <button
                  title="EDITAR"
                  className="btn btn-primary me-1"
                  type="submit"
                >
                  Editar
                </button>
              ) : (
                <button
                  title="AGREGAR"
                  className="btn btn-primary me-1"
                  type="submit"
                >
                  Agregar
                </button>
              )}
              <button
                onClick={cancelar}
                title="CANCELAR"
                className="btn btn-warning"
                type="reset"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
        <div
          style={{ height: "282px", overflowY: "auto" }}
          className="card-body p-1 bg-white text-dark"
        >
          <table className="table table-striped table-bordered text-dark">
            <thead>
              <tr className="text-center">
                <th scope="col">
                  <i className="bi bi-trash"></i>
                </th>
                <th scope="col">
                  <i className="bi bi-pencil"></i>
                </th>
                <th scope="col">Descripción</th>
                <th scope="col">Precio</th>
                <th className="text-nowrap" scope="col">
                  Compuesto Asociado
                </th>
              </tr>
            </thead>
            <tbody>
              {modificadores.map((modificador) => {
                let compuesto = "sin compuesto";
                let findCompuesto = compuestos.find(
                  (compuesto) => compuesto._id === modificador.compuestoId
                );
                if (findCompuesto) compuesto = findCompuesto.name;
                return (
                  <tr
                    key={modificador.id}
                    style={{ cursor: "default" }}
                    onClick={() => setIdx(modificador.id)}
                    className={`text-uppercase ${
                      idx === modificador.id ? "bg-info" : ""
                    }`}
                  >
                    <td>
                      <button
                        onClick={() => targetDeleteModificador(modificador.id)}
                        title="ELIMINAR"
                        type="button"
                        className="btn btn-danger btn-sm"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => selectModificador(modificador.id)}
                        title="EDITAR"
                        type="button"
                        className="btn btn-primary btn-sm ms-1"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                    </td>
                    <td className="text-dark text-nowrap">
                      {modificador.name}
                    </td>
                    <td className="text-end text-dark">${modificador.price}</td>
                    <td className="text-nowrap text-dark">{compuesto}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="card-footer p-1">
          <p className="p-0 m-0 card-text">
            <span className="fw-bolder">Creación: </span>
            <span>
              {modificador.createdAt &&
                formatearFecha(modificador.createdAt).fechaHora}
            </span>
          </p>
          <p className="p-0 m-0 card-text">
            <span className="fw-bolder">Creado por: </span>
            <span>{modificador.createdBy}</span>
          </p>
          <p className="p-0 m-0 card-text">
            <span className="fw-bolder">Última edición: </span>
            <span>
              {modificador.lastEdit &&
                formatearFecha(modificador.lastEdit).fechaHora}
            </span>
          </p>
        </div>
      </div>
      <ModalConfirm
        action={() => deleteModificador(idx)}
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

export default FormModificadores;
