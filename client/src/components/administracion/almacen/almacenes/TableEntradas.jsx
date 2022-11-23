import { useState } from "react";
import { formatearFecha } from "../../../../assets/helpers";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
import es from "javascript-time-ago/locale/es.json";
TimeAgo.addLocale(es);

function TableEntradas({ entradas, deleteEntrada }) {
  const [idx, setIdx] = useState("");

  const targetDeleteEntrada = (body) => {
    if (!window.confirm("Confirmar Acción")) return;
    deleteEntrada(body);
  };

  const checkCaducidad = (fecha) => {
    let res = "no definido";
    if (fecha === "") return res;
    const diaVencimiento = new Date(fecha).getDate();
    const diaActual = new Date(Date.now()).getDate();
    const dias = diaVencimiento - diaActual;

    res = dias;
    return res;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title">Registro de Entradas</h5>
      </div>
      <div
        style={{ height: "400px", overflow: "auto" }}
        className="card-body p-0 bg-white"
      >
        <table className="table table-bordered text-dark">
          <thead>
            <tr className="text-center text-uppercase">
              <th scope="col">
                <i className="bi bi-trash"></i>
              </th>
              <th scope="col">Descripción</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Precio</th>
              <th scope="col">Importe</th>
              <th scope="col">Proveedor</th>
              <th scope="col">Caducidad</th>
              <th scope="col">Registro</th>
              <th scope="col">Operador</th>
            </tr>
          </thead>
          <tbody>
            {entradas.map((entrada) => (
              <tr
                key={entrada._id}
                id={entrada._id}
                style={{ cursor: "default" }}
                onClick={() => setIdx(entrada._id)}
                className={`text-uppercase ${
                  entrada._id === idx ? "bg-info" : ""
                }`}
              >
                <th scope="row" className="text-center">
                  <button
                    onClick={() => targetDeleteEntrada(entrada)}
                    title="ELIMINAR"
                    type="button"
                    className="btn btn-danger btn-sm"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </th>
                <td className="text-nowrap align-middle">
                  {entrada.inStock && (
                    <i title="En Stock" className="bi bi-check-circle me-1"></i>
                  )}
                  {entrada.name}
                </td>
                <td className="text-nowrap text-center align-middle">
                  {entrada.cantidad} {entrada.medida}
                </td>
                <td className="text-nowrap text-end align-middle">
                  ${entrada.precioUnit}
                </td>
                <td className="text-nowrap text-end align-middle">
                  ${entrada.importe}
                </td>
                <td className="text-nowrap text-center align-middle">
                  {entrada.proveedor}
                </td>
                <td className="text-nowrap text-center align-top">
                  <div
                    style={{ fontSize: "0.8em" }}
                    className="d-flex flex-column"
                  >
                    <span>{entrada.caducidad} </span>
                    <small
                      className={`${
                        checkCaducidad(entrada.caducidad) <= 7
                          ? "bg-danger text-white"
                          : "bg-success"
                      }`}
                    >
                      <ReactTimeAgo
                        date={new Date(entrada.caducidad)}
                        locale="es-MX"
                        timeStyle="instagram"
                      />
                    </small>
                  </div>
                </td>
                <td className="text-nowrap align-middle">
                  {formatearFecha(entrada.createdAt).fechaHora}
                </td>
                <td className="text-nowrap align-middle">
                  {entrada.createdBy}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-footer text-end">
        <span className="h4">
          Total: $
          {entradas &&
            entradas.reduce((sum, i) => sum + parseInt(i.importe), 0)}
        </span>
      </div>
    </div>
  );
}

export default TableEntradas;
