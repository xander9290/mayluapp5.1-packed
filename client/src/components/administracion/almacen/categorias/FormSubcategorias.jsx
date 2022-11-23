import { useState } from "react";
import { formatearFecha, verifyExiste } from "../../../../assets/helpers";
import { appContext } from "../../../../context/MainContext";
import ModalAlert from "../../../ModalAlert";
import ModalConfirm from "../../../ModalConfirm";

const initialSubcategoria = {
  name: "",
  categoriaId: "",
  modificadores: [],
  lastEdit: "",
};

function FormSubcategorias({
  modificadores,
  setModificadores,
  setSelectedSubcategoria,
}) {
  const {
    categorias,
    subcategorias,
    createSubcategoria,
    updateSubcategoria,
    deleteSubcategoria,
    session,
  } = appContext();

  const [subcategoria, setSubcategoria] = useState(initialSubcategoria);
  const [id, setId] = useState("");

  const [modalAlert, setModalAlert] = useState({ show: false, msg: "" });
  const [modalConfirm, setModalConfirm] = useState(false);

  const handleSubcategoria = (e) => {
    setSubcategoria({ ...subcategoria, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subcategoria._id) {
      const newSubcat = {
        ...subcategoria,
        modificadores,
        lastEdit: Date.now(),
      };
      updateSubcategoria(subcategoria._id, newSubcat);
      cancelar();
    } else {
      const newSubcat = {
        ...subcategoria,
        modificadores,
        createdBy: session.operador,
      };
      if (verifyExiste(subcategorias, subcategoria.name)) {
        setModalAlert({
          show: true,
          msg: `El valor "${subcategoria.name}" para esta subcategoría no esta disponible`,
        });
        return;
      }
      createSubcategoria(newSubcat);
      cancelar();
    }
  };

  const selectSubcategoria = (id) => {
    const findSubcategoria = subcategorias.find(
      (subcategoria) => subcategoria._id === id
    );
    if (findSubcategoria) {
      setSubcategoria(findSubcategoria);
      const newModificadores = [];
      findSubcategoria.modificadores.map((m, i) => {
        newModificadores.push({
          ...m,
          id: i + 1,
        });
      });
      setModificadores(newModificadores);
      setSelectedSubcategoria("");
    } else {
      alert("Not Found");
    }
  };

  const targetDeleteSubcategoria = (id) => {
    setId(id);
    setModalConfirm(true);
  };

  const cancelar = () => {
    setSubcategoria(initialSubcategoria);
    setModificadores([]);
    setSelectedSubcategoria("none");
  };

  return (
    <>
      <div className="card">
        <div className="card-header p-1">
          <h5 className="card-title">
            Subcategorías
            <span className="badge bg-primary ms-1 me-2">
              {subcategorias.length}
            </span>
            {subcategoria._id && "<Modo Edición>"}
          </h5>
          <form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-between">
              <input
                className="form-control fw-bold"
                type="text"
                name="name"
                value={subcategoria.name}
                onChange={handleSubcategoria}
                autoComplete="off"
                required
                placeholder="Nombre"
              />
              <select
                className="form-select text-uppercase"
                name="categoriaId"
                value={subcategoria.categoriaId}
                onChange={handleSubcategoria}
                required
              >
                <option value="">Categoría</option>
                {categorias.map((categoria) => (
                  <option
                    className="fs-5"
                    key={categoria._id}
                    value={categoria._id}
                  >
                    {categoria.name}
                  </option>
                ))}
              </select>
              {subcategoria._id ? (
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
            {subcategorias.map((subcategoria) => {
              let fondo = "indefinido",
                name = "indefinido";
              let findCategoria = categorias.find(
                (categoria) => categoria._id === subcategoria.categoriaId
              );
              if (findCategoria) {
                name = findCategoria.name;
                fondo = findCategoria.fondo;
              }
              return (
                <li
                  key={subcategoria._id}
                  style={{ backgroundColor: fondo, cursor: "default" }}
                  className="list-group-item d-flex justify-content-between align-items-center text-uppercase"
                >
                  <div>
                    <p
                      className={`p-0 m-0 fs-5 fw-bolder ${
                        findCategoria ? "text-dark" : "text-white"
                      }`}
                    >
                      {subcategoria.name}
                    </p>
                    <small
                      className={`m-0 ${
                        findCategoria ? "text-dark" : "text-white"
                      }`}
                    >
                      {findCategoria ? name : "sin categoría"}
                    </small>
                  </div>
                  <div>
                    <button
                      onClick={() => targetDeleteSubcategoria(subcategoria._id)}
                      title="ELIMINAR"
                      type="button"
                      className="btn btn-danger"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                    <button
                      onClick={() => selectSubcategoria(subcategoria._id)}
                      title="EDITAR"
                      type="button"
                      className="btn btn-primary ms-1"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="card-footer p-1">
          <p className="p-0 m-0 card-text">
            <span className="fw-bolder">Creación: </span>
            <span>
              {subcategoria.createdAt &&
                formatearFecha(subcategoria.createdAt).fechaHora}
            </span>
          </p>
          <p className="p-0 m-0 card-text">
            <span className="fw-bolder">Creado por: </span>
            <span>{subcategoria.createdBy}</span>
          </p>
          <p className="p-0 m-0 card-text">
            <span className="fw-bolder">Última edición: </span>
            <span>
              {subcategoria.lastEdit &&
                formatearFecha(subcategoria.lastEdit).fechaHora}
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
        action={async () => deleteSubcategoria(id)}
        show={modalConfirm}
        onHide={() => setModalConfirm(false)}
      />
    </>
  );
}

export default FormSubcategorias;
