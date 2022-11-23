import { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { formatearFecha, verifyExisteMesa } from "../../../assets/helpers";
import { appContext } from "../../../context/MainContext";
import ModalAlert from "../../ModalAlert";

const initialPll = {
  torreta: "mostrador",
  servicio: "pll",
};
const initialCliente = {
  name: "",
  tel: "",
  calle: "",
  _id: "",
};
function ModalParaLLevar({ show, onHide, targetModalCaptura }) {
  const {
    clientes,
    cuentas,
    cuenta,
    createCuenta,
    updateCuenta,
    session,
    createActividad,
  } = appContext();

  const { fecha } = formatearFecha(Date.now());

  const torretaInputRef = useRef();
  const telInputRef = useRef();

  const [pll, setPll] = useState(initialPll);
  const [cliente, setCliente] = useState(initialCliente);
  const [modalAlert, setModalAlert] = useState({ show: false, msg: "" });

  const handlePll = (e) => {
    setPll({ ...pll, [e.target.name]: e.target.value });
  };
  const handleCliente = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (verifyExisteMesa(cuentas, pll.torreta) && pll.torreta !== "mostrador") {
      setModalAlert({ show: true, msg: "nombre no disponible" });
      torretaInputRef.current.focus();
      return;
    }
    if (cuenta._id) {
      const newCta = {
        ...cuenta,
        ...pll,
        clienteId: cliente._id,
      };
      await updateCuenta(cuenta._id, newCta);
      onHide();
    } else {
      const newCta = {
        ...cuenta,
        ...pll,
        clienteId: cliente._id,
        fecha,
        createdBy: session.operador,
      };
      const res = await createCuenta(newCta);
      if (res.res) {
        createActividad(
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

  const handleSubmitCliente = (e) => {
    e.preventDefault();
    const findCliente = clientes.find((cte) => cte.tel === cliente.tel.trim());
    if (findCliente) {
      const { name, calle, _id } = findCliente;
      setCliente({ ...cliente, name, calle: calle ? calle : "", _id });
      setPll({ ...pll, torreta: name });
    } else {
      setModalAlert({ show: true, msg: "cliente no encontrado" });
      telInputRef.current.focus();
    }
  };

  const cancelarPll = () => {
    setPll(initialPll);
  };
  const cancelarCliente = () => {
    setCliente(initialCliente);
  };

  const handleShow = () => {
    torretaInputRef.current.select();
    if (cuenta._id) {
      setPll({ ...pll, torreta: cuenta.torreta });
      const findCliente = clientes.find((c) => c._id === cuenta.clienteId);
      if (findCliente) {
        const { name, tel, calle, _id } = findCliente;
        setCliente({ name, tel, calle, _id });
      }
    }
  };

  const handleExited = () => {
    cancelarPll();
    cancelarCliente();
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
        dialogClassName="modal-form-comedor"
        size="sm"
      >
        <div className="container-fluid bg-dark">
          <div className="row">
            <div className="col-md-12 p-1 d-flex justify-content-between bg-secondary">
              <h3>Servicio para llevar</h3>
              <button className="btn btn-danger" type="button" onClick={onHide}>
                Cerrar
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
                    data-bs-target="#abrir-cuenta"
                    type="button"
                    role="tab"
                    aria-controls="nav-home"
                    aria-selected="true"
                  >
                    Abrir Orden
                  </button>
                  <button
                    className="nav-link fs-5"
                    data-bs-toggle="tab"
                    data-bs-target="#cliente"
                    type="button"
                    role="tab"
                    aria-controls="cliente"
                    aria-selected="false"
                  >
                    Cliente
                  </button>
                </div>
              </nav>
              <div className="tab-content">
                <div
                  className="tab-pane fade show active"
                  id="abrir-cuenta"
                  role="tabpanel"
                  aria-labelledby="abrir-cuenta-tab"
                >
                  {/* Form Cuenta nueva */}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                      <input
                        className="form-control form-control-lg fw-bold"
                        type="text"
                        name="torreta"
                        maxLength="10"
                        value={pll.torreta}
                        onChange={handlePll}
                        ref={torretaInputRef}
                        autoComplete="off"
                        required
                        placeholder=""
                      />
                    </div>
                    <div className="mb-2">
                      {cuenta._id ? (
                        <button
                          type="submit"
                          className="btn btn-success btn-lg"
                        >
                          <i className="bi bi-pencil me-2"></i>
                          Editar
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-success btn-lg"
                        >
                          <i className="bi bi-file-plus me-2"></i>
                          Abrir
                        </button>
                      )}
                      <button
                        onClick={cancelarPll}
                        type="reset"
                        className="btn btn-warning btn-lg ms-2"
                      >
                        <i className="bi bi-x-square me-2"></i>
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
                <div
                  className="tab-pane fade"
                  id="cliente"
                  role="tabpanel"
                  aria-labelledby="cliente-tab"
                >
                  {/* cliente search form */}
                  <form onSubmit={handleSubmitCliente}>
                    <div className="mb-3 d-flex">
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        name="tel"
                        ref={telInputRef}
                        value={cliente.tel}
                        onChange={handleCliente}
                        autoComplete="off"
                        placeholder="Teléfono"
                        required
                      />
                      <button
                        title="BUSCAR"
                        className="btn btn-primary btn-lg"
                        type="submit"
                      >
                        <i className="bi bi-search"></i>
                      </button>
                    </div>
                    <div className="mb-2 d-flex">
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        name="name"
                        value={cliente.name}
                        onChange={handleCliente}
                        autoComplete="off"
                        placeholder="Nombre"
                        readOnly
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        name="calle"
                        value={cliente.calle}
                        onChange={handleCliente}
                        autoComplete="off"
                        placeholder="Calle"
                        readOnly
                      />
                    </div>
                    <div className="mb-2">
                      <button
                        onClick={cancelarCliente}
                        type="reset"
                        className="btn btn-warning btn-lg"
                      >
                        <i className="bi bi-x-square me-2"></i>
                        Cancelar
                      </button>
                    </div>
                  </form>
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

export default ModalParaLLevar;
