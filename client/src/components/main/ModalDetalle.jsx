import { useEffect } from "react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { formatearFecha, procesarItems } from "../../assets/helpers";
import { appContext } from "../../context/MainContext";
import ModalAlert from "../ModalAlert";
import ModalConfirm from "../ModalConfirm";
import styles from "./Main.module.css";
import ModalCancelarItem from "./ModalCancelarItem";
import ModalDescuentoCuenta from "./ModalDescuentoCuenta";
import ModalDescuentoItem from "./ModalDescuentoItem";
import ModalDividirCuenta from "./ModalDividirCuenta";

function ModalDetalle({
  show,
  onHide,
  modalCaptura,
  reabrir,
  targetModalTicketNegocio,
  targetPagarCuenta,
  setIsOpenDetalle,
}) {
  const { cuenta, updateCuenta, reiniciarCuenta, procesarCompuestos, session } =
    appContext();

  const [itemsIdx, setItemsIdx] = useState(null);
  const [modalCencelarItem, setModalCencelarItem] = useState({
    show: false,
    index: null,
  });
  const [modalDescuento, setModalDescuento] = useState({
    show: false,
    index: null,
  });
  const [modalAlert, setModalAlert] = useState({ show: false, msg: "" });
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalDescuentoCuenta, setModalDescuentoCuenta] = useState(false);
  const [modalDividirCuenta, setModalDividirCuenta] = useState(false);

  const selectItem = (idx) => {
    setItemsIdx(idx);
  };

  const targetModalCancelarItem = (index) => {
    if (session.rol !== "master" && session.rol !== "cajero") {
      setModalAlert({
        show: true,
        msg: "operador no autorizado",
      });
      return;
    }
    setModalCencelarItem({ show: true, index });
  };

  const targetModalDescuento = (index) => {
    if (session.rol !== "master" && session.rol !== "cajero") {
      setModalAlert({
        show: true,
        msg: "operador no autorizado",
      });
      return;
    }
    setModalDescuento({ show: true, index });
  };

  const targetDescuentoCuenta = () => {
    if (session.rol !== "master" && session.rol !== "cajero") {
      setModalAlert({
        show: true,
        msg: "operador no autorizado",
      });
      return;
    }
    if (cuenta.impreso) {
      setModalAlert({ show: true, msg: "la cuenta ya se encuntra impresa" });
      return;
    }
    setModalDescuentoCuenta(true);
  };

  const targetCapturaModal = () => {
    setTimeout(() => {
      modalCaptura();
    }, 200);
  };

  const targetTicketNegocio = () => {
    targetModalTicketNegocio();
    onHide();
  };

  const targetDividirCuenta = () => {
    if (session.rol !== "master" && session.rol !== "cajero") {
      setModalAlert({
        show: true,
        msg: "operador no autorizado",
      });
      return;
    }
    if (cuenta.impreso) {
      setModalAlert({ show: true, msg: "la cuenta ya se encuntra impresa" });
      return;
    }
    setModalDividirCuenta(true);
  };

  const targetPagar = () => {
    if (!cuenta.impreso) {
      setModalAlert({
        show: true,
        msg: "es necesario imprimir la cuenta primero",
      });
      return;
    }
    targetPagarCuenta();
  };

  const handleExited = () => {
    setItemsIdx("");
    reiniciarCuenta();
    setIsOpenDetalle(false);
  };

  return (
    <>
      <Modal
        onHide={onHide}
        show={show}
        backdrop="static"
        keyboard={false}
        onExited={handleExited}
        size="xl"
      >
        <div className="container-fluid bg-dark user-select-none main">
          <div className="row">
            <div className="col-md-12 bg-success p-1 d-flex justify-content-between">
              <h3>
                Detalle de la orden {cuenta.orden}{" "}
                {cuenta.servicio === "pll" ? "Para LLevar" : cuenta.servicio}
              </h3>
              <button
                onClick={() => targetCapturaModal()}
                disabled={cuenta.impreso ? true : false}
                type="button"
                className="btn btn-success btn-lg text-uppercase text-dark fw-bold border-dark"
              >
                <i className="bi bi-card-list"></i> capturar
              </button>
              <button
                onClick={targetTicketNegocio}
                type="button"
                className="btn btn-success btn-lg text-uppercase text-dark fw-bold border-dark"
              >
                <i className="bi bi-printer"></i> imprimir
              </button>
              <div className="btn-group dropdown">
                <button
                  type="button"
                  className="btn btn-success dropdown-toggle text-uppercase btn-lg text-dark fw-bold border-dark"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  opciones
                </button>
                <ul className="dropdown-menu text-uppercase">
                  <li>
                    <a
                      onClick={targetPagar}
                      className="dropdown-item fs-4 py-2"
                      href="#"
                    >
                      <i className="bi bi-cash-coin me-2"></i> pagar
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={targetDividirCuenta}
                      className="dropdown-item fs-4 py-2"
                      href="#"
                    >
                      <i className="bi bi-layout-split me-2"></i>
                      dividir
                    </a>
                  </li>
                  {cuenta.impreso && (
                    <li>
                      <a
                        onClick={() => setModalConfirm(true)}
                        className="dropdown-item fs-4 py-2"
                        href="#"
                      >
                        <i className="bi bi-arrow-repeat me-2"></i>
                        reabrir
                      </a>
                    </li>
                  )}
                  <li>
                    <a
                      onClick={targetDescuentoCuenta}
                      className="dropdown-item fs-4 py-3"
                      href="#"
                    >
                      -(%) descuento
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
            <div className="col-md-12 p-1">
              <div className="card bg-white">
                <div className="card-header p-1 d-flex justify-content-between">
                  <ul className="list-group list-group-horizontal text-uppercase">
                    <li className="list-group-item">
                      <span className="fw-bolder">torreta: </span>
                      {cuenta.torreta}
                    </li>
                    <li className="list-group-item">
                      <span className="fw-bolder">folio: </span>
                      {cuenta.folio}
                    </li>
                    <li className="list-group-item px-1">
                      <span className="fw-bolder">
                        <i className="bi bi-clock"></i>{" "}
                      </span>
                      {formatearFecha(cuenta.createdAt).fechaHora}
                    </li>
                    {cuenta.closedAt && (
                      <li className="list-group-item px-1">
                        <span className="fw-bolder">cierre: </span>
                        {formatearFecha(cuenta.closedAt).hora}
                      </li>
                    )}
                    <li className="list-group-item">
                      <span className="fw-bolder">operador: </span>
                      {cuenta.createdBy}
                    </li>
                    <li className="list-group-item">
                      <span className="fw-bolder">Reparto: </span>
                      {cuenta.repartidor && cuenta.repartidor}
                    </li>
                  </ul>
                  {cuenta.impreso && (
                    <h4>
                      <i className="bi bi-printer me-2"></i>Impreso
                    </h4>
                  )}
                </div>
                <div className={`card-body p-0 ${styles.bodyItems}`}>
                  <table className="table table-bordered border-dark">
                    <thead>
                      <tr className="text-uppercase text-center bg-secondary text-white">
                        <th scope="col">#</th>
                        <th scope="col">
                          {cuenta.estado !== "abierto" ? null : (
                            <i className="bi bi-x-circle"></i>
                          )}
                        </th>
                        <th scope="col">-%</th>
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
                            onClick={() => selectItem(i)}
                            key={i}
                            className={`fw-bold text-uppercase ${
                              itemsIdx === i ? "bg-info" : ""
                            } ${item.cancelado ? "bg-danger" : ""} `}
                          >
                            <th scope="row">{i + 1}</th>
                            <th scope="row" className="text-center">
                              <button
                                disabled={
                                  item.cancelado
                                    ? true
                                    : false || cuenta.impreso
                                    ? true
                                    : false
                                }
                                onClick={() => targetModalCancelarItem(i)}
                                title="CANCELAR"
                                type="button"
                                className="btn btn-danger btn-sm"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </th>
                            <th scope="row" className="text-center">
                              {item.cancelado ? null : (
                                <button
                                  disabled={cuenta.impreso ? true : false}
                                  onClick={() => targetModalDescuento(i)}
                                  title="DESCONTAR"
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                >
                                  -%
                                </button>
                              )}
                            </th>
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
                <div style={{ overflowX: "auto" }} className="card-footer p-1">
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
      <ModalCancelarItem
        show={modalCencelarItem.show}
        onHide={() => setModalCencelarItem({ show: false, index: null })}
        index={modalCencelarItem.index}
        cuenta={cuenta}
        updateCuenta={updateCuenta}
        procesarCompuestos={procesarCompuestos}
      />
      <ModalDescuentoItem
        show={modalDescuento.show}
        onHide={() => setModalDescuento({ show: false, index: null })}
        index={modalDescuento.index}
        cuenta={cuenta}
        updateCuenta={updateCuenta}
      />
      <ModalAlert
        show={modalAlert.show}
        onHide={() => setModalAlert({ show: false, msg: "" })}
        msg={modalAlert.msg}
      />
      <ModalConfirm
        action={reabrir}
        show={modalConfirm}
        onHide={() => setModalConfirm(false)}
      />
      <ModalDescuentoCuenta
        show={modalDescuentoCuenta}
        onHide={() => setModalDescuentoCuenta(false)}
        cuenta={cuenta}
        updateCuenta={updateCuenta}
      />
      <ModalDividirCuenta
        show={modalDividirCuenta}
        onHide={() => setModalDividirCuenta(false)}
      />
    </>
  );
}

export default ModalDetalle;
