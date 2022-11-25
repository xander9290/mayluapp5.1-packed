import { useState } from "react";
import { formatearFecha, verifyExiste } from "../../../../assets/helpers";

const initValues = {
  name: "",
  insumos: [],
};
function FormAlmacenes({
  almacen,
  almacenes,
  createAlmacen,
  deleteAlmacen,
  updateAlmacen,
  selectAlmacen,
}) {
  const [values, setValues] = useState(initValues);

  const handleValues = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (values._id) {
      updateAlmacen(values._id, values);
    } else {
      if (verifyExiste(almacenes, values.name.toLowerCase().trim())) {
        alert("Nombre no disponible");
        return;
      }
      createAlmacen(values);
    }
    cancelar();
  };

  const editarAlmacen = (al) => {
    setValues(al);
  };

  const eliminarAlmacen = (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    deleteAlmacen(id);
  };

  const cancelar = () => {
    setValues(initValues);
  };
  return (
    <div className="card">
      <div className="card-header p-1">
        <h5 className="card-title d-flex justify-content-between align-items-end">
          <span>Almacenes</span>
          <span className="text-uppercase">{almacen?.name}</span>
        </h5>
        <form onSubmit={handleSubmit} className="d-flex">
          <input
            className="form-control form-control-sm"
            type="text"
            name="name"
            value={values.name}
            onChange={handleValues}
            autoComplete="off"
            placeholder="Nuevo"
            required
          />
          <button
            title={values._id ? "EDITAR" : "AGREGAR"}
            className="btn btn-primary btn-sm"
            type="submit"
          >
            {values._id ? (
              <i className="bi bi-pencil"></i>
            ) : (
              <i className="bi bi-plus-circle"></i>
            )}
          </button>
          <button
            onClick={cancelar}
            title="CANCELAR"
            className="btn btn-warning btn-sm ms-1"
            type="reset"
          >
            <i className="bi bi-x-circle"></i>
          </button>
        </form>
      </div>
      <div
        style={{ height: "175px", overflowY: "auto" }}
        className="card-body p-2"
      >
        <ul className="list-group">
          {almacenes.map((al) => (
            <li
              key={al._id}
              className={`list-group-item ${
                al._id === almacen._id ? "bg-info" : "bg-white"
              } d-flex justify-content-between align-items-center`}
            >
              <div>
                <button
                  onClick={() => eliminarAlmacen(al._id)}
                  className="btn btn-danger btn-sm me-2"
                  type="button"
                >
                  <i className="bi bi-trash"></i>
                </button>
                <button
                  onClick={() => editarAlmacen(al)}
                  title="EDITAR"
                  className="btn btn-primary btn-sm"
                  type="submit"
                >
                  <i className="bi bi-pencil"></i>
                </button>
              </div>
              <span className="card-text text-dark text-uppercase fw-bold">
                {al.name}
              </span>
              <button
                onClick={() => selectAlmacen(al._id)}
                type="button"
                className="btn btn-primary btn-sm"
              >
                <i className="bi bi-arrow-right-square"></i>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-footer p-1">
        <p className="p-0 m-0 card-text">
          <span className="fw-bolder">Creación: </span>
          <span>
            {almacen.createdAt && formatearFecha(almacen.createdAt).fechaHora}
          </span>
        </p>
      </div>
    </div>
  );
}

export default FormAlmacenes;
