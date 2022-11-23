import { useEffect, useState } from "react";
import { formatearFecha, procesarItems } from "../../../assets/helpers";
import { appContext } from "../../../context/MainContext";
import ModalAlert from "../../ModalAlert";
import ModalConfirm from "../../ModalConfirm";

function ClienteHistorial({ historial, operador, clienteName, onHide }) {
  const { createCuenta, initialCuenta } = appContext();
  const { fecha } = formatearFecha(Date.now());

  const [cuenta, setCuenta] = useState(initialCuenta);
  const [modalAlert, setModalAlert] = useState({ show: false, msg: "" });
  const [modalConfirm, setModalConfirm] = useState(false);

  useEffect(() => {
    if (historial.length === 0) setCuenta(initialCuenta);
  }, [historial]);

  const selectCuenta = (id) => {
    const getCuenta = historial.find((cuenta) => cuenta._id === id);
    if (getCuenta) setCuenta(getCuenta);
  };

  const pedir = async () => {
    const oldItems = cuenta.items;
    const newItems = [];
    oldItems.map((item) => {
      item.createdAt = Date.now();
      item.createdBy = operador;
      newItems.push(item);
    });
    const imposible =
      oldItems.filter((item) => item.cancelado === true || item.dscto > 0)
        .length > 0;
    if (imposible) {
      setModalAlert({
        show: true,
        msg: "imposible volver a pedir esta orden ya que cuenta con productos alterados",
      });
      return;
    }
    const { importe, totalConDscto } = procesarItems(newItems, cuenta.dscto);
    const newCta = {
      ...initialCuenta,
      servicio: "domicilio",
      torreta: clienteName,
      clienteId: cuenta.clienteId,
      items: newItems,
      cashInfo: {
        ...cuenta.cashInfo,
        importe,
        total: totalConDscto,
      },
      fecha,
      createdBy: operador,
      impreso: false,
      estado: "abierto",
    };

    await createCuenta(newCta);
    onHide();
  };

  return (
    <>
      <div className="row">
        {/* caja de pedidos */}
        <div className="col-md-5">
          <div className="card bg-white">
            <div className="card-header p-1">
              <h5 className="card-title text-center">Historial de Pedidos</h5>
            </div>
            <div className="card-body p-1 card-historial">
              <div style={{ overflowY: "scroll" }} className="list-group">
                {historial.map((cuenta) => (
                  <button
                    key={cuenta._id}
                    onClick={() => selectCuenta(cuenta._id)}
                    type="button"
                    className="list-group-item list-group-item-action d-flex justify-content-between mb-1"
                  >
                    <span className="fw-bold fs-5">
                      {formatearFecha(cuenta.createdAt).fecha}
                    </span>
                    <span className="fw-bold fs-5">{cuenta.servicio}</span>
                    <span className="fw-bold fs-5">
                      ${cuenta.cashInfo.total}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="card-footer p-1">
              <button
                disabled={cuenta._id ? false : true}
                onClick={() => setModalConfirm(true)}
                type="button"
                className="btn btn-success btn-lg text-dark fw-bold"
              >
                Volver a Pedir
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card bg-white">
            <div className="card-header p-1">
              <ul className="list-group list-group-horizontal text-uppercase">
                <li className="list-group-item p-1">
                  <span className="fw-bold">orden: </span>
                  {cuenta.orden}
                </li>
                <li className="list-group-item p-1">
                  <span className="fw-bold">apertura: </span>
                  {cuenta.createdAt &&
                    formatearFecha(cuenta.createdAt).fechaHora}
                </li>
                <li className="list-group-item p-1">
                  <span className="fw-bold">cierre: </span>
                  {cuenta.closedAt && formatearFecha(cuenta.closedAt).fechaHora}
                </li>
                <li className="list-group-item p-1">
                  <span className="fw-bold">operador: </span>
                  {cuenta.createdBy}
                </li>
              </ul>
            </div>
            <div
              style={{ overflow: "scroll" }}
              className="card-body p-1 card-historial"
            >
              <table className="table table-bordered text-dark">
                <thead>
                  <tr className="text-uppercase text-center">
                    <th scope="col">cant</th>
                    <th scope="col">desc</th>
                    <th scope="col">importe</th>
                  </tr>
                </thead>
                <tbody>
                  {cuenta.items &&
                    cuenta.items.map((item, i) => (
                      <tr
                        style={{ cursor: "default" }}
                        key={i}
                        className={`fw-bold text-uppercase ${
                          item.cancelado ? "bg-danger" : ""
                        }`}
                      >
                        <td className="text-center fs-5">{item.cant}</td>
                        <td>
                          <p className="p-0 m-0 text-nowrap fs-5">
                            {item.name}
                            {item.cancelado ? "(X)" : ""}
                          </p>
                          {item.modificadores.map((mod, i) => (
                            <small key={i}>
                              <p className="p-0 m-0 text-nowrap">
                                {">>"} {mod.name}{" "}
                                {mod.price > 0 ? "$" + mod.price : ""}
                              </p>
                            </small>
                          ))}
                        </td>
                        <td
                          className={`text-end fs-5 ${
                            item.dscto > 0 ? "bg-warning" : ""
                          }`}
                        >
                          ${item.importe}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer p-1 d-flex justify-content-end">
              <ul className="list-group list-group-horizontal text-uppercase">
                <li className="list-group-item">
                  <h5>importe: ${cuenta.cashInfo.importe}</h5>
                </li>
                <li className="list-group-item">
                  <h5>dscto: -${cuenta.cashInfo.dscto}</h5>
                </li>
                <li className="list-group-item">
                  <h5>total: ${cuenta.cashInfo.total}</h5>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <ModalAlert
        show={modalAlert.show}
        onHide={() => setModalAlert({ show: false, msg: "" })}
        msg={modalAlert.msg}
      />
      <ModalConfirm
        action={pedir}
        show={modalConfirm}
        onHide={() => setModalConfirm(false)}
      />
    </>
  );
}

export default ClienteHistorial;
