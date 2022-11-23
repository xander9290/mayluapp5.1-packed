import { useState } from "react";
import { Modal } from "react-bootstrap";
import { formatearFecha } from "../../assets/helpers";
import { appContext } from "../../context/MainContext";
import ModalObservaciones from "../main/ModalObservaciones";
import TicketCliente from "../main/tickets/TicketCliente";
import TicketNegocio from "../main/tickets/TicketNegocio";
import ModalAlert from "../ModalAlert";
import ModalAuth from "../ModalAuth";

const initFecha = {
  fecha1: formatearFecha(Date.now()).fecha,
  fecha2: formatearFecha(Date.now()).fecha,
};
function ModalCuentasCerradas({ show, onHide }) {
  const {
    updateCuenta,
    initialCuenta,
    getCuentasByFechas,
    cargarCuentas,
    createActividad,
    session,
  } = appContext();

  const [fecha, setFecha] = useState(initFecha);
  const [listaCuentas, setListaCuentas] = useState([]);
  const [cuenta, setCuenta] = useState(initialCuenta);

  const [comanda, setComanda] = useState(false);
  const [notaCliente, setNotaCliente] = useState(false);

  const [modalAuth, setModalAuth] = useState(false);
  const [modalAlert, setModalAlert] = useState({ show: false, msg: "" });

  const [modalObservaciones, setModalObservaciones] = useState(false);

  const handleFecha = (e) => {
    setFecha({ ...fecha, [e.target.name]: e.target.value });
  };

  const handleSubmitFecha = (e) => {
    e.preventDefault();
    fetchCuentas(fecha.fecha1, fecha.fecha2);
  };

  const getCuentasCerradas = async (ctas) => {
    const getCuentas = ctas.filter(
      (cuenta) => cuenta.estado === "cerrado" || cuenta.estado === "cancelado"
    );
    setListaCuentas([...getCuentas]);
  };

  const fetchCuentas = async (gte, lte) => {
    const data = await getCuentasByFechas(gte, lte);
    if (data.cuentas.length > 0) {
      getCuentasCerradas(data.cuentas);
    } else {
      setModalAlert({
        show: true,
        msg: "no se encontraron cuentas con las fechas establecidas",
      });
      setListaCuentas([]);
      setCuenta(initialCuenta);
    }
  };

  const selectCuenta = (id) => {
    const findCuenta = listaCuentas.find((cuenta) => cuenta._id === id);
    if (findCuenta) {
      setCuenta(findCuenta);
    } else {
      setCuenta(initialCuenta);
    }
  };

  const reabrir = async (master) => {
    const newCta = {
      ...cuenta,
      estado: "abierto",
      repartidor: "",
      impreso: false,
      time: "",
    };
    const res = await updateCuenta(cuenta._id, newCta);
    if (res) {
      await fetchCuentas(fecha.fecha1, fecha.fecha2);
      setCuenta(initialCuenta);
      await cargarCuentas();
      await createActividad(
        session.operador,
        `${session.operador} ha reabierto la orden ${cuenta.orden}`,
        master
      );
    }
  };

  const targetModalAuth = () => {
    if (!cuenta._id) {
      setModalAlert({
        show: true,
        msg: "selecciona una cuenta",
      });
      return;
    }
    setModalAuth(true);
  };

  const targetComandaModal = () => {
    if (!cuenta._id) {
      setModalAlert({ show: true, msg: "selecciona una cuenta" });
      return;
    }
    if (cuenta.cashInfo.total === 0) {
      setModalAlert({ show: true, msg: "orden sin productos" });
      return;
    }
    setComanda(true);
  };

  const targetNotaCliente = () => {
    if (!cuenta._id) {
      setModalAlert({ show: true, msg: "selecciona una cuenta" });
      return;
    }
    setNotaCliente(true);
  };

  const handleShow = () => {
    fetchCuentas(fecha.fecha1, fecha.fecha2);
  };
  const handleExited = () => {
    setFecha(initFecha);
    setCuenta(initialCuenta);
  };

  return (
    <>
      <Modal
        onHide={onHide}
        show={show}
        backdrop="static"
        keyboard={false}
        onShow={handleShow}
        onExited={handleExited}
        dialogClassName="cuentas-cerradas-modal user-select-none"
      >
        <div className="container-fluid bg-dark main">
          <div className="row">
            <div className="col-md-12 p-1 d-flex justify-content-between bg-success">
              <h4>
                Cuentas Cerradas
                <span className="badge bg-primary ms-2">
                  {listaCuentas.length}
                </span>
              </h4>
              <form onSubmit={handleSubmitFecha} className="d-flex">
                <input
                  type="date"
                  name="fecha1"
                  value={fecha.fecha1}
                  max={formatearFecha(Date.now()).fecha}
                  onChange={handleFecha}
                  className="form-control form-control-lg"
                  required
                />
                <input
                  type="date"
                  name="fecha2"
                  value={fecha.fecha2}
                  max={formatearFecha(Date.now()).fecha}
                  onChange={handleFecha}
                  className="form-control form-control-lg"
                  required
                />
                <button type="submit" className="btn btn-primary btn-lg">
                  <i className="bi bi-search"></i>
                </button>
              </form>
              <div className="btn-group dropdown ms-2">
                <button
                  type="button"
                  className="btn btn-success border-dark dropdown-toggle text-uppercase btn-lg text-dark"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  opciones
                </button>
                <ul className="dropdown-menu text-uppercase">
                  <li>
                    <a
                      onClick={targetModalAuth}
                      className="dropdown-item fs-4 py-2"
                      href="#"
                    >
                      reabrir
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={targetComandaModal}
                      className="dropdown-item fs-4 py-2"
                      href="#"
                    >
                      <i className="bi bi-printer h4 me-2"></i>negocio
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={targetNotaCliente}
                      className="dropdown-item fs-4 py-2"
                      href="#"
                    >
                      <i className="bi bi-printer h4 me-2"></i>cliente
                    </a>
                  </li>
                </ul>
              </div>
              <button className="btn btn-danger" type="button" onClick={onHide}>
                Cerrar
                <i className="bi bi-x-circle ms-2"></i>
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 p-1">
              {/* cuentas list */}
              <div className="card bg-white">
                <div
                  style={{ height: "572px", overflowY: "scroll" }}
                  className="card-body p-1"
                >
                  <div className="list-group">
                    {listaCuentas.map(
                      (cuenta) =>
                        cuenta._id && (
                          <button
                            key={cuenta._id}
                            onClick={() => selectCuenta(cuenta._id)}
                            type="button"
                            className={`list-group-item list-group-item-action d-flex justify-content-between text-uppercase mb-1 px-1 py-3`}
                          >
                            <span>or: {cuenta.orden}</span>
                            <span
                              className={`${
                                cuenta.estado === "cancelado"
                                  ? "px-2 bg-danger"
                                  : ""
                              }`}
                            >
                              {cuenta.servicio}
                              {cuenta.estado === "cancelado" ? "(X)" : ""}
                            </span>
                            <span>
                              {formatearFecha(cuenta.createdAt).fechaHora}
                            </span>
                            <span>f: {cuenta.folio}</span>
                          </button>
                        )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8 p-1">
              <div className="card bg-white">
                <div className="card-header p-1 d-flex justify-content-between">
                  <ul className="list-group list-group-horizontal text-uppercase">
                    <li className="list-group-item text-nowrap">
                      <span className="fw-bolder">torreta: </span>
                      {cuenta.torreta}
                    </li>
                    <li className="list-group-item px-1 text-nowrap">
                      <span className="fw-bolder">cierre: </span>
                      {formatearFecha(cuenta.closedAt).fechaHora}
                    </li>
                    <li className="list-group-item text-nowrap">
                      <span className="fw-bolder">operador: </span>
                      {cuenta.createdBy}
                    </li>
                    <li className="list-group-item">
                      <span className="fw-bolder">Rep: </span>
                      {cuenta.repartidor && cuenta.repartidor}
                    </li>
                    {cuenta.obs !== "" && (
                      <li
                        onClick={() => setModalObservaciones(true)}
                        role="button"
                        className="list-group-item"
                      >
                        <i className="bi bi-chat-dots"></i>
                      </li>
                    )}
                  </ul>
                </div>
                <div
                  style={{ height: "450px", overflow: "auto" }}
                  className="card-body p-0"
                >
                  <table className="table table-bordered border-dark">
                    <thead>
                      <tr className="text-uppercase text-center bg-secondary text-white">
                        <th scope="col">cant</th>
                        <th scope="col">descripción</th>
                        <th scope="col">importe</th>
                        <th scope="col">precio</th>
                        <th scope="col">dscto</th>
                        <th scope="col">operador</th>
                        <th scope="col">captura</th>
                      </tr>
                    </thead>
                    <tbody className="text-dark">
                      {cuenta._id &&
                        cuenta.items.map((item, i) => (
                          <tr
                            style={{ cursor: "default" }}
                            key={i}
                            className={`fw-bold text-uppercase`}
                          >
                            <td className="text-center fs-5">{item.cant}</td>
                            <td>
                              <p className="p-0 m-0 text-nowrap fs-5">
                                {item.name} {item.cancelado ? "(X)" : ""}
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
                            <td
                              className={`text-end fs-5 ${
                                item.dscto > 0 ? "bg-warning" : ""
                              }`}
                            >
                              ${item.price}
                            </td>
                            <td
                              className={`text-end fs-5 ${
                                item.dscto > 0 ? "bg-warning" : ""
                              }`}
                            >
                              -${item.dscto}
                            </td>
                            <td className="text-end fs-5">{item.createdBy}</td>
                            <td className="text-end fs-5">
                              {formatearFecha(item.createdAt).hora}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-footer p-1">
                  <div className="d-flex justify-content-end">
                    <ul className="list-group list-group-horizontal text-uppercase">
                      <li className="list-group-item fs-5">
                        importe: ${cuenta.cashInfo.importe}
                      </li>
                      <li className="list-group-item fs-5">
                        dscto: -%{cuenta.cashInfo.dscto}
                      </li>
                      <li className="list-group-item fs-5">
                        efectivo: ${cuenta.cashInfo.efectivo}
                      </li>
                      <li className="list-group-item fs-5">
                        cambio: ${cuenta.cashInfo.cambio}
                      </li>
                      <li className="list-group-item fs-5">
                        total: ${cuenta.cashInfo.total}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <TicketNegocio
        show={comanda}
        onHide={() => setComanda(false)}
        cuenta={cuenta}
      />
      <TicketCliente
        show={notaCliente}
        onHide={() => setNotaCliente(false)}
        cuenta={cuenta}
      />
      <ModalAuth
        action={reabrir}
        show={modalAuth}
        onHide={() => setModalAuth(false)}
      />
      <ModalAlert
        show={modalAlert.show}
        onHide={() => setModalAlert({ show: false, msg: "" })}
        msg={modalAlert.msg}
      />
      <ModalObservaciones
        show={modalObservaciones}
        onHide={() => setModalObservaciones(false)}
        cuenta={cuenta}
      />
    </>
  );
}

export default ModalCuentasCerradas;
