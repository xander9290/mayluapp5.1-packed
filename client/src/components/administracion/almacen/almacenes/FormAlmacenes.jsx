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
  selectAlmacen,
}) {
  const [values, setValues] = useState(initValues);

  const handleValues = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (verifyExiste(almacenes, values.name.toLowerCase().trim())) {
      alert("Nombre no disponible");
      return;
    }
    createAlmacen(values);
    cancelar();
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
            className="form-control"
            type="text"
            name="name"
            value={values.name}
            onChange={handleValues}
            autoComplete="off"
            placeholder="Nuevo"
            required
          />
          <button title="AGREGAR" className="btn btn-primary" type="submit">
            <i className="bi bi-plus-circle"></i>
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
              <span className="card-text text-dark text-uppercase fw-bold">
                {al.name}
              </span>
              <button
                onClick={() => eliminarAlmacen(al._id)}
                className="btn btn-danger"
                type="button"
              >
                <i className="bi bi-trash"></i>
              </button>
              <button
                onClick={() => selectAlmacen(al._id)}
                type="button"
                className="btn btn-primary"
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
