import { useState } from "react";
import { formatearFecha, verifyExiste } from "../../../../assets/helpers";
import { appContext } from "../../../../context/MainContext";
import ModalAlert from "../../../ModalAlert";
import ModalConfirm from "../../../ModalConfirm";

const initialCategoria = {
  name: "",
  fondo: "#FFFFFF",
  lastEdit: "",
  compuestos: [],
};

function FormCategorias() {
  const {
    categorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    session,
  } = appContext();

  const [categoria, setCategoria] = useState(initialCategoria);
  const [id, setId] = useState("");

  const [modalAlert, setModalAlert] = useState({ show: false, msg: "" });
  const [modalConfirm, setModalConfirm] = useState(false);

  const handleCategoria = (e) => {
    setCategoria({ ...categoria, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoria._id) {
      const newCategoria = {
        ...categoria,
        lastEdit: Date.now(),
      };
      updateCategoria(categoria._id, newCategoria);
      cancelar();
    } else {
      const newCategoria = {
        ...categoria,
        createdBy: session.operador,
      };
      if (verifyExiste(categorias, categoria.name)) {
        setModalAlert({
          show: true,
          msg: `El valor "${categoria.name}" para esta categoría no esta disponible`,
        });
        return;
      }
      createCategoria(newCategoria);
      cancelar();
    }
  };

  const selectCategoria = (id) => {
    const findCategoria = categorias.find((categoria) => categoria._id === id);
    if (findCategoria) {
      setCategoria(findCategoria);
    } else {
      alert("Cannot find categoria".toUpperCase());
    }
  };

  const targetDeleteCategoria = (id) => {
    setId(id);
    setModalConfirm(true);
  };

  const cancelar = () => {
    setCategoria(initialCategoria);
  };

  return (
    <>
      <div className="card mb-1">
        <div className="card-header p-1">
          <h5 className="card-title">
            Categorías
            <span className="badge bg-primary ms-1 me-1">
              {categorias.length}
            </span>
            {categoria._id && "<Modo Edición>"}
          </h5>
          <form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-between">
              <input
                className="form-control fw-bold"
                type="text"
                name="name"
                value={categoria.name}
                onChange={handleCategoria}
                autoComplete="off"
                required
                placeholder="Nombre"
              />
              <input
                className="form-control form-control-color"
                type="color"
                name="fondo"
                value={categoria.fondo}
                onChange={handleCategoria}
                required
              />
              {categoria._id ? (
                <button
                  title="EDITAR"
                  className="btn btn-primary me-1"
                  type="submit"
                >
                  <i className="bi bi-pencil"></i>
                </button>
              ) : (
                <button
                  title="AGREGAR"
                  className="btn btn-primary me-1"
                  type="submit"
                >
                  <i className="bi bi-plus-circle"></i>
                </button>
              )}
              <button
                onClick={cancelar}
                title="CANCELAR"
                className="btn btn-warning"
                type="reset"
              >
                <i className="bi bi-x-circle"></i>
              </button>
            </div>
          </form>
        </div>
        <div
          style={{ height: "370px", overflowY: "auto" }}
          className="card-body p-1"
        >
          <ul className="list-group">
            {categorias.map((categoria) => (
              <li
                key={categoria._id}
                style={{ backgroundColor: categoria.fondo }}
                className="list-group-item d-flex justify-content-between align-items-center text-uppercase"
              >
                <span className="fw-bold fs-5 text-dark" role="button">
                  {categoria.name}
                </span>
                <div>
                  <button
                    onClick={() => targetDeleteCategoria(categoria._id)}
                    title="ELIMINAR"
                    type="button"
                    className="btn btn-danger"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                  <button
                    onClick={() => selectCategoria(categoria._id)}
                    title="EDITAR"
                    type="button"
                    className="btn btn-primary ms-1"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-footer p-1">
          <p className="p-0 m-0 card-text">
            <span className="fw-bolder">Creación: </span>
            <span>
              {categoria.createdAt &&
                formatearFecha(categoria.createdAt).fechaHora}
            </span>
          </p>
          <p className="p-0 m-0 card-text">
            <span className="fw-bolder">Creado por: </span>
            <span>{categoria.createdBy}</span>
          </p>
          <p className="p-0 m-0 card-text">
            <span className="fw-bolder">Última edición: </span>
            <span>
              {categoria.lastEdit &&
                formatearFecha(categoria.lastEdit).fechaHora}
            </span>
          </p>
        </div>
      </div>
      <ModalAlert
        show={modalAlert.show}
        onHide={() => setModalAlert({ show: false, msg: "" })}
        msg={modalAlert.msg}
      />
      <ModalConfirm
        action={async () => deleteCategoria(id)}
        show={modalConfirm}
        onHide={() => setModalConfirm(false)}
      />
    </>
  );
}

export default FormCategorias;
