import { useState, useRef } from "react";
import { formatearFecha } from "../../../../assets/helpers";

const initValues = {
  name: "",
  importe: 0,
  precioUnit: 0,
  cantidad: 0,
  proveedor: "",
  createdAt: Date.now(),
  createdBy: "",
  codigo: null,
  insumoId: "",
  inStock: true,
  caducidad: formatearFecha(Date.now()).fecha,
  fecha: formatearFecha(Date.now()).fecha,
};
function FormEntradas({
  almacen,
  insumos,
  createEntrada,
  operador,
  fechas,
  getEntradas,
}) {
  const buscarRef = useRef("");
  const precioRef = useRef("");

  const [buscar, setBuscar] = useState("");
  const [values, setValues] = useState(initValues);
  const [idx, setIdx] = useState("");
  const [inStock, setInStock] = useState(true);

  const handleBuscar = (e) => {
    e.preventDefault();
    if (!almacen._id) {
      alert("Selecciona un almacen para continuar");
      return;
    }
    const findInsumo = insumos.find(
      (insumo) => insumo.codigo === buscar.trim()
    );
    if (findInsumo) {
      setValues({
        ...values,
        insumoId: findInsumo._id,
        name: findInsumo.name,
        codigo: findInsumo.codigo,
        createdBy: operador,
        medida: findInsumo.medida,
      });
      precioRef.current.select();
    } else {
      alert("Insumo no encontrado");
    }
  };

  const handleValues = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleInStock = () => {
    setInStock(!inStock);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBody = {
      ...values,
      inStock,
    };
    if (createEntrada(values.insumoId, newBody)) {
      reiniciar();
      buscarRef.current.focus();
    }
  };

  const reiniciar = () => {
    setValues(initValues);
    setBuscar("");
    setInStock(true);
  };

  return (
    <div className="card">
      <div className="card-header p-1">
        <h5 className="card-title">Entrada de Almacén</h5>
        <form onSubmit={handleBuscar} className="d-flex">
          <input
            className="form-control"
            type="text"
            maxLength="5"
            name="buscar"
            ref={buscarRef}
            value={buscar}
            onChange={(e) => setBuscar(e.target.value.trim())}
            required
            autoComplete="off"
            placeholder="Código..."
          />
          <button title="BUSCAR" className="btn btn-primary" type="submit">
            <i className="bi bi-search"></i>
          </button>
        </form>
      </div>
      <form onSubmit={handleSubmit} className="card-body p-2">
        <div className="mb-1">
          <input
            className="form-control text-uppercase"
            type="text"
            value={values.name}
            placeholder="Descripción"
            readOnly
          />
        </div>
        <div className="mb-1 d-flex">
          <div className="text-center">
            <label className="form-label">Precio Unit</label>
            <input
              className="form-control"
              type="number"
              name="precioUnit"
              ref={precioRef}
              value={values.precioUnit}
              onChange={handleValues}
              required
              autoComplete="off"
            />
          </div>
          <div className="text-center">
            <label className="form-label">Cantidad</label>
            <input
              className="form-control"
              type="number"
              value={values.cantidad}
              onChange={handleValues}
              name="cantidad"
              autoComplete="off"
            />
          </div>
          <div className="text-center">
            <label className="form-label">Importe</label>
            <input
              className="form-control"
              type="number"
              name="importe"
              value={values.importe}
              onChange={handleValues}
              required
              autoComplete="off"
            />
          </div>
        </div>
        <div className="mb-1">
          <input
            className="form-control"
            type="text"
            name="proveedor"
            value={values.proveedor}
            onChange={handleValues}
            placeholder="Proveedor"
            autoComplete="off"
          />
        </div>
        <div className="mb-1">
          <input
            className="form-control"
            type="date"
            name="caducidad"
            value={values.caducidad}
            min={formatearFecha(Date.now()).fecha}
            autoComplete="off"
            onChange={handleValues}
          />
        </div>
        <div className="mb-2">
          <div className="form-check">
            <label className="form-check-label">
              <input
                type="checkbox"
                name="inStock"
                checked={inStock}
                onChange={handleInStock}
                className="form-check-input"
              />
              Entra en Stock
            </label>
          </div>
        </div>
        <button className="btn btn-primary" type="submit">
          Aceptar
        </button>
        <button
          onClick={reiniciar}
          className="btn btn-warning ms-1"
          type="reset"
        >
          Cancelar
        </button>
      </form>
      <div
        style={{ height: "190px", overflowY: "auto" }}
        className="card-footer bg-white p-1"
      >
        <ul className="list-group">
          {fechas.map((fecha) => (
            <li
              key={fecha._id}
              onClick={() => setIdx(fecha._id)}
              className={`list-group-item ${
                fecha._id === idx ? "bg-info" : "bg-white"
              } text-dark d-flex justify-content-between align-items-center`}
            >
              <button
                onClick={() => getEntradas(fecha.fecha)}
                type="submit"
                className="btn btn-primary"
              >
                <i className="bi bi-arrow-left-square"></i>
              </button>
              <span>{formatearFecha(fecha.createdAt).fechaHora}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FormEntradas;
