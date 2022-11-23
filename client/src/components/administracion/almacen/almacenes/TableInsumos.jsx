import { useState, useEffect } from "react";
import { formatearFecha } from "../../../../assets/helpers";

function TableInsumos({
  insumos,
  setInsumo,
  deleteInsumo,
  lastUpdate,
  actualizarStock,
}) {
  const [listInsumos, setListInsumos] = useState([]);
  const [idx, setIdx] = useState("");
  const [buscar, setBuscar] = useState({ buscar: "" });

  useEffect(() => {
    setListInsumos(insumos);
  }, [insumos]);

  const targetDeleteInsumo = (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    deleteInsumo(id);
  };

  const selectInsumo = (id) => {
    const getInsumo = insumos.find((insumo) => insumo._id === id);
    if (getInsumo) setInsumo(getInsumo);
  };

  const handleBuscar = (e) => {
    setBuscar({ ...buscar, [e.target.name]: e.target.value });
  };

  const handleSubmitBuscar = (e) => {
    e.preventDefault();
    setIdx("");
    busqueda();
  };

  const busqueda = () => {
    const result = insumos.filter(
      (insumo) =>
        insumo.name.toLowerCase().includes(buscar.buscar.toLocaleLowerCase()) ||
        insumo.codigo === buscar.buscar
    );
    if (result.length === 1) {
      const id = result[0]._id;
      setIdx(id);
      document.getElementById(id).scrollIntoView();
    } else if (result.length > 1) {
      setIdx("");
      setListInsumos(result);
    } else {
      alert("Insumo no encontrado".toUpperCase());
    }
  };

  const handleActualizarStock = (e) => {
    e.preventDefault();
    const fecha = e.target.lastUpdate.value;
    actualizarStock(fecha);
  };

  const actualizar = () => {
    setListInsumos(insumos);
    setIdx("");
    setBuscar({ buscar: "" });
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-end">
        <form className="d-flex" onSubmit={handleSubmitBuscar}>
          <input
            className="form-control"
            type="text"
            name="buscar"
            value={buscar.buscar}
            onChange={handleBuscar}
            required
            autoComplete="off"
            placeholder="Buscar..."
          />
          <button title="BUSCAR" className="btn btn-primary" type="submit">
            <i className="bi bi-search"></i>
          </button>
        </form>
        <h5 className="card-title">Registro de Insumos</h5>
        <button
          onClick={actualizar}
          type="button"
          className="btn btn-success text-dark"
        >
          <i className="bi bi-arrow-repeat me-2"></i>
          Actualizar
        </button>
      </div>
      <div
        style={{ height: "400px", overflow: "auto" }}
        className="card-body p-1 bg-white"
      >
        <table className="table table-bordered text-dark">
          <thead>
            <tr className="text-center text-uppercase">
              <th scope="col">
                <i className="bi bi-trash"></i>
              </th>
              <th scope="col">
                <i className="bi bi-pencil"></i>
              </th>
              <th scope="col">Descripción</th>
              <th scope="col">Cantidad</th>
              <th className="bg-warning" scope="col">
                Stock
              </th>
              <th scope="col">Precio</th>
              <th scope="col">Código</th>
              <th scope="col">Creación</th>
              <th scope="col">Proveedor</th>
            </tr>
          </thead>
          <tbody>
            {listInsumos.map((insumo) => (
              <tr
                key={insumo._id}
                id={insumo._id}
                style={{ cursor: "default" }}
                onClick={() => setIdx(insumo._id)}
                className={`text-uppercase ${
                  insumo._id === idx ? "bg-info" : ""
                }`}
              >
                <th scope="row" className="text-center">
                  <button
                    onClick={() => targetDeleteInsumo(insumo._id)}
                    title="ELIMINAR"
                    type="button"
                    className="btn btn-danger btn-sm"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </th>
                <th scope="row" className="text-center">
                  <button
                    onClick={() => selectInsumo(insumo._id)}
                    title="EDITAR"
                    type="button"
                    className="btn btn-primary btn-sm"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </th>
                <td className="fs-6 text-nowrap align-middle">{insumo.name}</td>
                <td className="fs-6 text-nowrap text-center align-middle">
                  {insumo.cantidad} {insumo.medida}
                </td>
                {insumo.stock > 0 ? (
                  <td className="fs-6 text-nowrap text-end align-middle bg-warning fw-bold">
                    {parseInt(insumo.stock)} {insumo.medida}
                  </td>
                ) : (
                  <td className="fs-6 text-nowrap text-end align-middle bg-danger fw-bold">
                    agotado
                  </td>
                )}
                <td className="fs-6 text-nowrap text-end align-middle">
                  ${insumo.precio}
                </td>
                <td className="fs-6 text-nowrap text-center align-middle">
                  {insumo.codigo}
                </td>
                <td className="fs-6 text-nowrap text-center align-middle">
                  {formatearFecha(insumo.createdAt).fechaHora}
                </td>
                <td className="fs-6 text-nowrap align-middle">
                  {insumo.proveedor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-footer d-flex justify-content-between align-items-end">
        <small className="text-center">
          Última actualización: {lastUpdate}
        </small>
        <form onSubmit={handleActualizarStock} className="d-flex">
          <input
            className="form-control"
            type="date"
            min={lastUpdate}
            max={formatearFecha(Date.now()).fecha}
            name="lastUpdate"
            required
          />
          <button className="btn btn-primary text-nowrap" type="submit">
            Actulizar Stock
          </button>
        </form>
      </div>
    </div>
  );
}

export default TableInsumos;
