import { useState } from "react";

function TableSalidas({ salidaInsumos }) {
  const [idx, setIdx] = useState("");
  const [insumos, setInsumos] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const gte = e.target.gte.value;
    const lte = e.target.lte.value;
    const data = await salidaInsumos(gte, lte);
    setInsumos(data);
  };
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-end align-items-end">
        <form onSubmit={handleSubmit} className="d-flex">
          <input className="form-control" type="date" name="gte" required />
          <input className="form-control" type="date" name="lte" required />
          <button title="BUSCAR" className="btn btn-primary" type="submit">
            <i className="bi bi-search"></i>
          </button>
        </form>
      </div>
      <div
        style={{ height: "400px", overflow: "auto" }}
        className="card-body p-0 bg-white"
      >
        <table className="table table-bordered text-dark">
          <thead>
            <tr>
              <th scope="col">Descripción</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Costo</th>
            </tr>
          </thead>
          <tbody>
            {insumos.map((insumo) => (
              <tr
                key={insumo._id}
                id={insumo._id}
                style={{ cursor: "default" }}
                onClick={() => setIdx(insumo._id)}
                className={`text-uppercase ${
                  insumo._id === idx ? "bg-info" : ""
                }`}
              >
                <td className="fs-6 text-nowrap align-middle">{insumo.desc}</td>
                <td className="fs-6 text-nowrap text-center align-middle">
                  {insumo.cantidad} {insumo.medida}
                </td>
                <td className="fs-6 text-nowrap text-end align-middle">
                  ${insumo.costo.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-footer text-end">
        <span className="h4">
          Costo total: $
          {insumos &&
            insumos.reduce((sum, i) => sum + parseFloat(i.costo), 0).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default TableSalidas;
