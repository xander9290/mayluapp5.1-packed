import { useState } from "react";
import { useRef } from "react";
import { formatearFecha, verifyExiste } from "../../../../assets/helpers";
import { appContext } from "../../../../context/MainContext";
import ModalAlert from "../../../ModalAlert";

function FormProductos({ producto, setProducto, initialProducto }) {
  const { productos, createProducto, updateProducto, subcategorias, session } =
    appContext();

  const [modalAlert, setModalAlert] = useState({ show: false, msg: "" });

  const nameInput = useRef();
  const handleProducto = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleContable = () => {
    setProducto({ ...producto, contable: !producto.contable });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (producto._id) {
      const newProd = {
        ...producto,
        lastEdit: Date.now(),
      };
      updateProducto(producto._id, newProd);
      cancelar();
    } else {
      const newProd = {
        ...producto,
        createdBy: session.operador,
      };
      if (verifyExiste(productos, producto.name)) {
        nameInput.current.focus();
        setModalAlert({
          show: true,
          msg: `El valor "${producto.name}" para este producto no esta disponible`,
        });
        return;
      }

      createProducto(newProd);
      cancelar();
    }
  };

  const cancelar = () => {
    setProducto(initialProducto);
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">
            Productos{" "}
            <span className="badge bg-primary">{productos.length}</span>
            {producto._id && <small>{" <Edición>"}</small>}
          </h5>
        </div>
        <div className="card-body p-2">
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="form-label fs-5">Producto Nuevo</label>
              <input
                className="form-control"
                type="text"
                name="name"
                ref={nameInput}
                value={producto.name}
                onChange={handleProducto}
                placeholder="Descripción"
                autoComplete="off"
                required
              />
            </div>
            <div className="mb-2 d-flex">
              <div className="input-group me-1">
                <span className="input-group-text">$</span>
                <input
                  className="form-control"
                  type="number"
                  name="price"
                  min="0"
                  value={producto.price}
                  onChange={handleProducto}
                  autoComplete="off"
                  required
                />
                <span className="input-group-text">.00</span>
              </div>
              <select
                className="form-select text-uppercase"
                name="areaNota"
                value={producto.areaNota}
                onChange={handleProducto}
                required
              >
                <option value="">Área Comanda</option>
                <option value="area1">area 1</option>
                <option value="area2">area 2</option>
                <option value="area3">area 3</option>
                <option value="area4">area 4</option>
              </select>
            </div>
            <div className="mb-2 d-flex align-items-end">
              <select
                className="form-select text-uppercase me-2"
                name="subcategoriaId"
                value={producto.subcategoriaId}
                onChange={handleProducto}
                required
              >
                <option value="">Subcategoría</option>
                {subcategorias.map((subcategoria) => (
                  <option key={subcategoria._id} value={subcategoria._id}>
                    {subcategoria.name}
                  </option>
                ))}
              </select>
              <div className="form-check form-switch fs-5">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={producto.contable}
                  onChange={handleContable}
                />
                <label className="form-check-label text-dark">Contable</label>
              </div>
            </div>
            <div className="mb-2">
              {producto._id ? (
                <button
                  title="EDITAR"
                  className="btn btn-primary"
                  type="submit"
                >
                  <i className="bi bi-pencil me-2"></i>
                  Editar
                </button>
              ) : (
                <button
                  title="AGREGAR"
                  className="btn btn-primary"
                  type="submit"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Agregar
                </button>
              )}
              <button
                onClick={cancelar}
                title="CANCELAR"
                className="btn btn-warning ms-2"
                type="reset"
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancelar
              </button>
            </div>
          </form>
        </div>
        <div className="card-footer p-1">
          <p className="p-0 m-0 card-text">
            <span className="fw-bolder">Creación: </span>
            <span>
              {producto.createdAt &&
                formatearFecha(producto.createdAt).fechaHora}
            </span>
          </p>
          <p className="p-0 m-0 card-text">
            <span className="fw-bolder">Creado por: </span>
            <span>{producto.createdBy}</span>
          </p>
          <p className="p-0 m-0 card-text">
            <span className="fw-bolder">Última edición: </span>
            <span>
              {producto.lastEdit && formatearFecha(producto.lastEdit).fechaHora}
            </span>
          </p>
        </div>
      </div>
      <ModalAlert
        show={modalAlert.show}
        onHide={() => modalAlert({ show: false, msg: "" })}
        msg={modalAlert.msg}
      />
    </>
  );
}

export default FormProductos;
