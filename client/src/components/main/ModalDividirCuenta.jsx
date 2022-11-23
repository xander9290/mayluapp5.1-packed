import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { formatearFecha, procesarItems } from "../../assets/helpers";
import { appContext } from "../../context/MainContext";
import ModalAlert from "../ModalAlert";
import ModalAuth from "../ModalAuth";
import ModalConfirm from "../ModalConfirm";

function ModalDividirCuenta({ show, onHide }) {
  const {
    cuenta,
    updateCuenta,
    createCuenta,
    initialCuenta,
    cargarCuentas,
    session,
    createActividad,
  } = appContext();

  const [lista1, setLista1] = useState([]);
  const [total1, setTotal1] = useState(0);
  const [lista2, setLista2] = useState([]);
  const [total2, setTotal2] = useState(0);
  const [items1Idx, setItems1Idx] = useState(null);
  const [items2Idx, setItems2Idx] = useState(null);

  const [modalAlert, setModalAlert] = useState({ show: false, msg: "" });
  const [modalConfirm, setModalConfirm] = useState(false);

  const [contador, setContador] = useState(1);
  const [torreta, setTorreta] = useState("");

  const torretaRef = useRef();

  useEffect(() => {
    if (cuenta._id) {
      cargarItems();
    }
  }, [cuenta]);

  useEffect(() => {
    calcularTotal1();
  }, [lista1]);

  const calcularTotal1 = () => {
    let total = 0;
    lista1
      .filter((item) => item.cancelado === false)
      .map((item) => (total += item.importe));
    setTotal1(total);
  };

  useEffect(() => {
    if (lista2.length > 0) {
      setItems2Idx(!lista2 ? 0 : lista2.length - 1);
      calcularTotal2();
    } else {
      setTotal2(0);
    }
  }, [lista2]);

  const calcularTotal2 = () => {
    let total = 0;
    lista2.map((item) => (total += item.importe));
    setTotal2(total);
  };

  const cargarItems = () => {
    setLista1(cuenta.items);
  };

  const handleTorreta = (e) => setTorreta(e.target.value);

  const selectItemList1 = (index) => {
    const list = lista1;
    const item = list[index];
    if (item.cant > 1) {
      setContador(item.cant);
      setItems1Idx(index);
    } else {
      setContador(item.cant);
      setItems1Idx(index);
    }
  };

  const enviarItem = () => {
    if (items1Idx === null) {
      setModalAlert({ show: true, msg: "Selecciona un item para continuar" });
      return;
    }
    const list = lista1;
    const item = list[items1Idx];
    if (item.cant > 1) {
      if (item.cant === parseInt(contador)) {
        const newItem = {
          ...list[items1Idx],
        };
        setLista2([...lista2, newItem]);
        list.splice(items1Idx, 1);
        setLista1([...list]);
        setItems1Idx(null);
      } else {
        const nvaCant = list[items1Idx].cant - parseInt(contador);
        list[items1Idx].cant = nvaCant;
        const price = list[items1Idx].price;
        const nvoImporte = price * nvaCant;
        list[items1Idx].importe = nvoImporte;
        const newItem = {
          ...list[items1Idx],
          importe: list[items1Idx].price * parseInt(contador),
          cancelado: false,
          cant: parseInt(contador),
          hora: Date.now(),
        };
        setLista2([...lista2, newItem]);
        setLista1([...list]);
        setItems1Idx(null);
      }
    } else {
      const newItem = {
        ...list[items1Idx],
      };
      setLista2([...lista2, newItem]);
      list.splice(items1Idx, 1);
      setLista1([...list]);
      setItems1Idx(null);
    }
  };

  const regresraItem = () => {
    if (items2Idx === null) {
      setModalAlert({ show: true, msg: "Selecciona un item para continuar" });
      return;
    }
    const list = lista2;
    const newItem = {
      ...list[items2Idx],
    };
    setLista1([...lista1, newItem]);
    list.splice(items2Idx, 1);
    setLista2([...list]);
    setItems2Idx(null);
  };

  const targetModalAuth = () => {
    if (torreta === "") {
      torretaRef.current.focus();
      return;
    }
    setModalConfirm(true);
  };

  const dividir = async (master) => {
    if (torreta === "") {
      torretaRef.current.focus();
      return;
    }
    const { importe, totalConDscto } = procesarItems(lista2, cuenta.dscto);
    const newCuenta = {
      ...initialCuenta,
      servicio: cuenta.servicio,
      torreta,
      clienteId: cuenta.clienteId,
      items: lista2,
      cashInfo: {
        ...cuenta.cashInfo,
        importe,
        total: totalConDscto,
      },
      fecha: formatearFecha(Date.now()).fecha,
      createdBy: session.operador,
      impreso: false,
      estado: "abierto",
    };
    const res = await createCuenta(newCuenta);
    if (res) {
      const { importe, totalConDscto } = procesarItems(lista1, cuenta.dscto);
      const newCta = {
        ...cuenta,
        items: lista1,
        cashInfo: {
          ...cuenta.cashInfo,
          importe,
          total: totalConDscto,
        },
      };
      const res2 = await updateCuenta(cuenta._id, newCta);
      if (res2) {
        await createActividad(
          session.operador,
          `${session.operador} ha dividido la orden ${cuenta.orden}`,
          master
        );
        onHide();
      }
    }
  };

  const handleShow = () => {
    setTorreta("");
  };
  const handleExited = async () => {
    await cargarCuentas();
    //setLista1([]);
    setLista2([]);
    setItems1Idx(null);
    setItems2Idx(null);
    setTotal1(0);
    setTotal2(0);
    setContador(1);
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
        dialogClassName="dividir-cuenta-modal"
      >
        <div className="container-fluid bg-dark user-select-none">
          <div className="row">
            <div className="col-md-12 p-1 d-flex justify-content-between bg-secondary">
              <h3>Dividir Cuenta</h3>
              {/* contador */}

              <div className="d-flex">
                <button
                  title="MENOS"
                  onClick={() =>
                    contador <= 1 ? undefined : setContador(contador - 1)
                  }
                  className="btn btn-warning ms-3 fw-bolder"
                  type="button"
                >
                  <i className="bi bi-dash"></i>
                </button>
                <input
                  style={{ width: "70px" }}
                  className="form-control text-center fw-bolder fs-5"
                  type="text"
                  value={contador}
                  readOnly
                />
              </div>
              <button
                onClick={targetModalAuth}
                disabled={lista2.length <= 0 ? true : false}
                type="button"
                className="btn btn-primary"
              >
                Dividir
              </button>
              <button className="btn btn-danger" type="button" onClick={onHide}>
                Cerrar
                <i className="bi bi-x-circle ms-2"></i>
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 p-1">
              <div className="card bg-white">
                <div className="card-header p-1 d-flex justify-content-between align-items-end">
                  <h5 className="card-title">Orden: {cuenta.orden}</h5>
                  <button
                    onClick={enviarItem}
                    title="ENVIAR"
                    type="button"
                    className="btn btn-warning btn-lg"
                  >
                    <i className="bi bi-arrow-right-square"></i>
                  </button>
                </div>
                <div className="card-body p-0 body-dividir-cuenta">
                  <table className="table table-bordered border-dark text-dark text-uppercase">
                    <thead>
                      <tr className="text-center fw-bolder">
                        <th scope="col">cant</th>
                        <th scope="col">descripción</th>
                        <th scope="col">importe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lista1.map((item, i) => (
                        <tr
                          key={i + 2}
                          className={`fs-5 ${
                            items1Idx === i ? "bg-info" : ""
                          } ${item.cancelado ? "bg-danger" : ""}`}
                          style={{
                            cursor: "default",
                            pointerEvents: item.cancelado ? "none" : "",
                          }}
                          onClick={() => selectItemList1(i)}
                        >
                          <td className="text-center fw-bold">{item.cant}</td>
                          <td className="text-start fw-bold">{item.name}</td>
                          <td className="text-end fw-bold">${item.importe}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-footer p-1 text-end">
                  <h3>Total: ${total1}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-6 p-1">
              <div className="card bg-white">
                <div className="card-header p-1 d-flex justify-content-between align-items-end">
                  <h5 className="card-title">Nueva Orden</h5>
                  <input
                    style={{ width: "150px" }}
                    className="form-control fw-bold fs-5"
                    maxLength="10"
                    type="text"
                    name="torreta"
                    ref={torretaRef}
                    value={torreta}
                    onChange={handleTorreta}
                    autoComplete="off"
                    placeholder="Torreta"
                  />
                  <button
                    onClick={regresraItem}
                    title="REGRESAR"
                    type="button"
                    className="btn btn-warning btn-lg"
                  >
                    <i className="bi bi-arrow-left-square"></i>
                  </button>
                </div>
                <div className="card-body p-0 body-dividir-cuenta">
                  {/* tabla nueva orden */}
                  <table className="table table-bordered border-dark text-dark text-uppercase">
                    <thead>
                      <tr className="text-center fw-bolder">
                        <th scope="col">cant</th>
                        <th scope="col">descripción</th>
                        <th scope="col">importe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lista2.map((item, i) => (
                        <tr
                          key={i + 4}
                          className={`fs-5 ${items2Idx === i ? "bg-info" : ""}`}
                          style={{
                            cursor: "default",
                          }}
                          onClick={() => setItems2Idx(i)}
                        >
                          <td className="text-center fw-bold">{item.cant}</td>
                          <td className="text-start fw-bold">{item.name}</td>
                          <td className="text-end fw-bold">${item.importe}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-footer p-1 text-end">
                  <h3>Total: ${total2}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <ModalAlert
        show={modalAlert.show}
        onHide={() => setModalAlert({ show: false, msg: "" })}
        msg={modalAlert.msg}
      />
      <ModalAuth
        action={dividir}
        show={modalConfirm}
        onHide={() => setModalConfirm(false)}
      />
    </>
  );
}

export default ModalDividirCuenta;
