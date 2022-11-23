import { useState } from "react";
import { formatearFecha } from "../../../assets/helpers";
import { appContext } from "../../../context/MainContext";

const initBusqueda = {
  operador: "",
  //criterio: "todo",
  fecha: formatearFecha(Date.now()).fecha,
};
function Actividad() {
  const { operadores, getActividad } = appContext();
  const [busqueda, setBusqueda] = useState(initBusqueda);
  const [actividad, setActividad] = useState([]);
  const [idx, setIdx] = useState("");
  const [msg, setMsg] = useState(false);

  const handleBusqueda = (e) => {
    setBusqueda({ ...busqueda, [e.target.name]: e.target.value });
    setMsg(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await getActividad(busqueda);
    if (data.length > 0) {
      setActividad(data);
    } else {
      setActividad([]);
      setMsg(true);
    }
  };

  const targets = () => {
    setIdx("");
  };
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="title">Registro de actividad</h5>
        <form
          style={{ width: "450px" }}
          onSubmit={handleSubmit}
          className="d-flex"
        >
          <select
            value={busqueda.operador}
            onChange={handleBusqueda}
            className="form-select text-uppercase"
            name="operador"
            required
          >
            <option value="">Operador</option>
            {operadores.map((operador) => (
              <option
                className="p-2 h5"
                key={operador._id}
                value={operador.name}
              >
                {operador.name}
              </option>
            ))}
          </select>
          {/* <select
            value={busqueda.criterio}
            onChange={handleBusqueda}
            className="form-select"
            name="criterio"
          >
            <option value="todo">Todo</option>
            <option value="fecha">Por fecha</option>
          </select> */}
          <input
            className="form-control"
            type="date"
            name="fecha"
            value={busqueda.fecha}
            onChange={handleBusqueda}
            max={formatearFecha(Date.now()).fecha}
          />
          <button type="submit" className="btn btn-primary" title="Buscar">
            <i className="bi bi-search"></i>
          </button>
        </form>
      </div>
      <div
        style={{ height: "510px", overflow: "scroll" }}
        className="card-body p-1 bg-white text-dark"
      >
        <table className="table table-bordered user-select-none bg-white text-dark">
          <thead>
            <tr className="text-uppercase text-center">
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Autorización</th>
            </tr>
          </thead>
          <tbody onMouseOut={targets}>
            {actividad.map((actividad) => (
              <tr
                key={actividad._id}
                onMouseOver={(e) => {
                  e.stopPropagation(), setIdx(actividad._id);
                }}
                className={`text-uppercase ${
                  actividad._id === idx ? "bg-info" : ""
                }`}
              >
                <td className="text-nowrap align-middle">{actividad.commit}</td>
                <td className="text-nowrap text-center align-middle">
                  {formatearFecha(actividad.createdAt).fechaHora}
                </td>
                <td className="text-center">{actividad.auth}</td>
              </tr>
            ))}
            {msg && (
              <tr>
                <td
                  colSpan="3"
                  className="bg-danger text-white fs-4 fw-bold border border-2 border-white text-uppercase text-center rounded"
                >
                  no se encontraron datos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Actividad;
