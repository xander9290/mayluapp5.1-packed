import { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { formatearFecha } from "../../../assets/helpers";
import routes from "../../../assets/routes";
import { appContext } from "../../../context/MainContext";
import ModalAlert from "../../ModalAlert";
import ClienteHistorial from "./ClienteHistorial";

const initialCliente = {
  name: "",
  tel: "",
  calle: "",
  cruces: "",
  colonia: "",
  obs: "",
  codigo: null,
  lastEdit: "",
};
let url;
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:3100/cuentas/cliente/";
} else {
  url = "/cuentas/cliente/";
}

function ModalDomicilio({ show, onHide, targetModalCaptura }) {
  const {
    cuenta,
    createCuenta,
    updateCuenta,
    clientes,
    createCliente,
    updateCliente,
    session,
    createActividad,
  } = appContext();
  const { fecha } = formatearFecha(Date.now());

  const buscarRef = useRef();
  const inputNameRef = useRef();

  const [cliente, setCliente] = useState(initialCliente);
  const [busqueda, setBusqueda] = useState({ entry: "" });
  const [listaClientes, setListaClientes] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [editarCliente, setEditarCliente] = useState("none");
  const [msg, setMsg] = useState(null);
  const [modalAlert, setModalAlert] = useState({ show: false, msg: "" });

  const handleCliente = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const disableEnterKey = (e) => {
    if (e.key === "Enter") {
      // alert(
      //   "La tecla enter está desactivada para este formuario".toUpperCase()
      // );
      e.preventDefault();
    }
  };

  const handleSubmitCliente = async (e) => {
    e.preventDefault();
    if (cliente._id) {
      const newCliente = {
        ...cliente,
        lastEdit: Date.now(),
      };
      await updateCliente(cliente._id, newCliente);
    } else {
      const newCliente = {
        ...cliente,
        createdBy: session.operador,
      };
      const res = await createCliente(newCliente);
      setCliente(res);
      setEditarCliente("none");
    }
  };

  const handleBusqueda = (e) => {
    setBusqueda({ ...busqueda, [e.target.name]: e.target.value });
    setListaClientes([]);
    setCliente(initialCliente);
    setHistorial([]);
    setMsg(null);
  };

  const handleSubmitBusqueda = (e) => {
    e.preventDefault();
    const findCliente = clientes.filter(
      (cliente) =>
        cliente.tel.trim() === busqueda.entry.trim() ||
        cliente.name.toLowerCase() === busqueda.entry.toLowerCase() ||
        cliente.codigo === parseInt(busqueda.entry)
    );
    if (findCliente.length > 0) {
      setListaClientes(findCliente);
    } else {
      setMsg("cliente no encontrado");
      buscarRef.current.select();
    }
  };

  const selectCliente = async (id) => {
    const select = listaClientes.find((cliente) => cliente._id === id);
    if (select) {
      setCliente(select);
      const getHistorial = await routes.get(url + select._id);
      setHistorial(getHistorial);
    }
  };

  const nuevoCliente = () => {
    setCliente({ ...initialCliente, tel: busqueda.entry });
    setEditarCliente("");
    setListaClientes([]);
    setBusqueda({ entry: "" });
    inputNameRef.current.focus();
  };

  const limpiarForm = () => {
    setCliente(initialCliente);
    setEditarCliente("none");
  };

  const editar = () => {
    if (!cliente._id) {
      setModalAlert({
        show: true,
        msg: "selecciona un cliente para continuar",
      });
      return;
    }
    setEditarCliente("");
    inputNameRef.current.focus();
  };

  const aceptar = async () => {
    if (cuenta._id) {
      const newCuenta = {
        ...cuenta,
        items: cuenta.items,
        torreta: cliente.name,
        clienteId: cliente._id,
      };
      await updateCuenta(cuenta._id, newCuenta);
      onHide();
    } else {
      const newCuenta = {
        ...cuenta,
        clienteId: cliente._id,
        torreta: cliente.name,
        servicio: "domicilio",
        fecha,
        createdBy: session.operador,
      };
      const res = await createCuenta(newCuenta);
      if (res.res) {
        await createActividad(
          session.operador,
          `${session.operador} ha creado la orden: ${res.data.orden}`,
          "system"
        );
        setTimeout(() => {
          targetModalCaptura();
        }, 150);
        onHide();
      }
    }
  };

  const handleShow = () => {
    buscarRef.current.focus();
  };
  const handleExited = () => {
    setCliente(initialCliente);
    setListaClientes([]);
    setEditarCliente("none");
    setHistorial([]);
    setBusqueda({ entry: "" });
    setMsg(null);
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
        dialogClassName="modal-form-domicilio"
        size="sm"
      >
        <div className="container-fluid main">
          <div className="row">
            <div className="col-md-12 p-1 d-flex justify-content-between bg-success">
              <h3>Servicio a Domicilio</h3>
              <button className="btn btn-danger" type="button" onClick={onHide}>
                CANCELAR
                <i className="bi bi-x-circle ms-2"></i>
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 p-1">
              <nav>
                <div className="nav nav-pills mb-1" role="tablist">
                  <button
                    className="nav-link active fs-5"
                    data-bs-toggle="tab"
                    data-bs-target="#formulario"
                    type="button"
                    role="tab"
                    aria-controls="formulario"
                    aria-selected="true"
                  >
                    Formulario
                  </button>
                  <button
                    className="nav-link fs-5"
                    data-bs-toggle="tab"
                    data-bs-target="#historial"
                    type="button"
                    role="tab"
                    aria-controls="historial"
                    aria-selected="false"
                  >
                    Historial
                    <span className="badge bg-secondary ms-2">
                      {historial.length}
                    </span>
                  </button>
                </div>
              </nav>
              <div className="tab-content">
                <div
                  className="tab-pane fade show active"
                  id="formulario"
                  role="tabpanel"
                  aria-labelledby="abrir-cuenta-tab"
                >
                  <div className="card-group">
                    {/* Formulario */}
                    <div className="card">
                      <div className="card-header p-1 d-flex justify-content-between">
                        <button
                          onClick={nuevoCliente}
                          type="button"
                          className="btn btn-success btn-lg text-dark fw-bold"
                        >
                          NUEVO
                        </button>
                        <button
                          onClick={editar}
                          type="button"
                          className="btn btn-success btn-lg text-dark fw-bold ms-2"
                        >
                          EDITAR
                        </button>
                        <button
                          onClick={aceptar}
                          type="button"
                          disabled={cliente._id ? false : true}
                          className="btn btn-success btn-lg text-dark fw-bold ms-2"
                        >
                          ACEPTAR
                        </button>
                      </div>
                      <div className="card-body p-1 text-dark">
                        <form
                          style={{ pointerEvents: editarCliente }}
                          onSubmit={handleSubmitCliente}
                          onKeyPress={(e) => disableEnterKey(e)}
                        >
                          <div className="mb-2">
                            <label className="label-form fs-5">Contacto</label>
                            <input
                              className="form-control form-control-lg mb-1"
                              type="text"
                              name="name"
                              maxLength="15"
                              ref={inputNameRef}
                              value={cliente.name}
                              onChange={handleCliente}
                              autoComplete="off"
                              required
                              placeholder="Nombre"
                            />
                            <input
                              className="form-control form-control-lg"
                              type="text"
                              name="tel"
                              value={cliente.tel}
                              onChange={handleCliente}
                              autoComplete="off"
                              required
                              placeholder="Teléfono"
                            />
                          </div>
                          <div className="mb-3">
                            <label className="label-form fs-5">Dirección</label>
                            <input
                              className="form-control form-control-lg mb-1"
                              type="text"
                              name="calle"
                              value={cliente.calle}
                              onChange={handleCliente}
                              autoComplete="out"
                              required
                              placeholder="Calle y Número"
                            />
                            <input
                              className="form-control form-control-lg mb-1"
                              type="text"
                              name="cruces"
                              value={cliente.cruces}
                              onChange={handleCliente}
                              autoComplete="no"
                              required
                              placeholder="Cruces"
                            />
                            <input
                              className="form-control form-control-lg mb-1"
                              type="text"
                              name="colonia"
                              value={cliente.colonia}
                              onChange={handleCliente}
                              autoComplete="off"
                              placeholder="Colonia"
                            />
                            <textarea
                              className="form-control form-control-lg"
                              name="obs"
                              value={cliente.obs}
                              onChange={handleCliente}
                              rows="2"
                              placeholder="Observaciones"
                            ></textarea>
                          </div>
                          <div className="mb-2">
                            <button
                              title="GUARDAR"
                              className="btn btn-primary btn-lg"
                              type="submit"
                            >
                              <i className="bi bi-plus-circle me-2"></i>
                              GUARDAR
                            </button>
                            <button
                              onClick={limpiarForm}
                              type="reset"
                              className="btn btn-success btn-lg ms-2"
                            >
                              <i className="bi bi-x-square me-2"></i>
                              LIMPIAR
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                    {/* Busqueda */}
                    <div className="card w-25">
                      <div className="card-header p-1 d-flex justify-content-end">
                        <form
                          onSubmit={handleSubmitBusqueda}
                          className="d-flex"
                        >
                          <input
                            className="form-control form-control-lg"
                            type="text"
                            name="entry"
                            ref={buscarRef}
                            value={busqueda.entry}
                            onChange={handleBusqueda}
                            autoComplete="off"
                            required
                            placeholder="Buscar..."
                          />
                          <button
                            title="BUSCAR"
                            className="btn btn-primary btn-lg"
                            type="submit"
                          >
                            <i className="bi bi-search"></i>
                          </button>
                        </form>
                      </div>
                      <div className="card-body p-1">
                        {msg && (
                          <div className="alert alert-danger text-center text-uppercase py-2">
                            <strong>{msg}</strong>
                          </div>
                        )}
                        <div className="list-group">
                          {listaClientes.map((cliente) => (
                            <button
                              key={cliente._id}
                              onClick={async () =>
                                await selectCliente(cliente._id)
                              }
                              type="button"
                              className="list-group-item list-group-item-action d-flex justify-content-between mb-1"
                            >
                              <span className="fw-bold fs-5">
                                {cliente.name}
                              </span>
                              <span className="fw-bold fs-5">
                                {cliente.calle}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="historial"
                  role="tabpanel"
                  aria-labelledby="cliente-tab"
                >
                  <ClienteHistorial
                    historial={historial}
                    initialCliente={initialCliente}
                    operador={session.operador}
                    clienteName={cliente.name}
                    onHide={onHide}
                  />
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
    </>
  );
}

export default ModalDomicilio;
