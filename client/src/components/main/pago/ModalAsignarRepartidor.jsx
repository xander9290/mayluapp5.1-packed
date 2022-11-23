import { useRef, useState } from "react";
import { appContext } from "../../../context/MainContext";
import { Modal } from "react-bootstrap";

const initialRepartidor = {
  name: "",
  hasRepartidor: false,
};
const initialEfectivo = {
  efectivo: 0,
};

function ModalAsignarRepartidor({ show, onHide, targetModalTicketCliente }) {
  const { cuenta, updateCuenta, operadores, abrirCajon } = appContext();

  const inputEfectivo = useRef();

  const [repartidor, setRepartidor] = useState(initialRepartidor);
  const [efectivo, setEfectivo] = useState(initialEfectivo);
  const [repartidores, setRepartidores] = useState([]);
  const [error, setError] = useState(null);

  const handleRepartidor = (e) => {
    setRepartidor({ ...repartidor, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleEfectivo = (e) => {
    let value = e.target.value;
    if (isNaN(value) || value === "") value = 0;
    setEfectivo({ ...efectivo, [e.target.name]: parseInt(value) });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (repartidor.name === "") {
      setError("selecciona un repartidor para continuar".toUpperCase());
      return;
    }
    if (cuenta.repartidor === "") {
      const cambio = parseInt(efectivo.efectivo) - cuenta.cashInfo.total;
      if (parseInt(efectivo.efectivo) < cuenta.cashInfo.total) {
        setError("monto incorrecto".toUpperCase());
        inputEfectivo.current.focus();
        return;
      }
      const newCuenta = {
        ...cuenta,
        cashInfo: {
          ...cuenta.cashInfo,
          efectivo: parseInt(efectivo.efectivo),
          cambio,
        },
        repartidor: repartidor.name,
        estado: "pendiente",
      };
      const res = await updateCuenta(cuenta._id, newCuenta);
      if (res) {
        targetModalTicketCliente();
        onHide();
        if (cambio > 0) await abrirCajon();
      }
    } else {
      const newCuenta = {
        ...cuenta,
        repartidor: repartidor.name,
      };
      const res = await updateCuenta(cuenta._id, newCuenta);
      if (res) {
        targetModalTicketCliente();
        onHide();
      }
    }
  };

  const filtrarRepartidores = () => {
    const findRepartidres = operadores.filter(
      (operador) => operador.rol === "repartidor"
    );
    if (findRepartidres.length > 0) setRepartidores(findRepartidres);
  };

  const selectRepartidor = (name) => {
    setRepartidor({ ...repartidor, name });
    inputEfectivo.current.focus();
  };

  const ifHasRepartidor = () => {
    if (cuenta.repartidor !== "") {
      setRepartidor({
        name: cuenta.repartidor,
        efectivo: cuenta.cashInfo.efectivo,
        hasRepartidor: true,
      });
      setEfectivo({ ...efectivo, efectivo: cuenta.cashInfo.efectivo });
    }
  };

  const handleShow = () => {
    if (cuenta.servicio !== "domicilio") onHide();
    ifHasRepartidor();
    inputEfectivo.current.focus();
    filtrarRepartidores();
  };
  const handleExited = () => {
    setRepartidor(initialRepartidor);
    setEfectivo(initialEfectivo);
    setError(null);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      onShow={handleShow}
      onExited={handleExited}
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-asignar-rep"
    >
      <form onSubmit={handleSubmit} className="card bg-light user-select-none">
        <div className="card-header d-flex justify-content-between align-items-end">
          <h5 className="card-title">Asignar repartidor</h5>
          <button className="btn btn-danger" type="button" onClick={onHide}>
            Cerrar
            <i className="bi bi-x-circle ms-2"></i>
          </button>
        </div>
        <div
          style={{ height: "112px", overflowY: "auto" }}
          className="card-body p-0"
        >
          <div className="container">
            <div className="row">
              {repartidores.map((rep) => (
                <div key={rep._id} className="col-md-6 p-1 d-grid">
                  <button
                    type="button"
                    onClick={() => selectRepartidor(rep.name)}
                    className={`btn ${
                      rep.name === repartidor.name ? "bg-warning" : "bg-success"
                    } border border-dark btn-lg text-dark fw-bold text-uppercase`}
                  >
                    {rep.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card-footer text-center">
          <div className="mb-2 d-flex justify-content-between">
            <label className="form-label h3">
              Saldo: ${cuenta.cashInfo.total}
            </label>
            <label className="form-label h3 text-uppercase">
              {repartidor.name}
            </label>
          </div>
          <div className="mb-2 d-flex flex-column align-items-center">
            <label className="form-label h3">Efectivo </label>
            <div style={{ width: "200px" }} className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="text"
                name="efectivo"
                ref={inputEfectivo}
                className="form-control fw-bolder fs-4 text-center"
                value={efectivo.efectivo}
                onChange={handleEfectivo}
                required
                autoComplete="off"
                readOnly={repartidor.hasRepartidor}
              />
              <span className="input-group-text">.00</span>
            </div>
          </div>
          <div className="mb-2">
            <label className="form-label h3">
              Cambio: $
              {(() => {
                const cambio =
                  parseInt(efectivo.efectivo) - cuenta.cashInfo.total;
                return cambio < 0 || isNaN(cambio) ? "0" : cambio;
              })()}
            </label>
          </div>
          <div className="mb-2 text-end">
            <button type="submit" className="btn btn-success btn-lg">
              Imprimir
            </button>
          </div>
          <div className="mb-2">
            {error && (
              <div className="bg-danger text-white fs-4 fw-bold border border-2 border-white text-uppercase text-center rounded">
                {error}
              </div>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default ModalAsignarRepartidor;
