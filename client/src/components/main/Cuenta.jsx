import { formatearFecha } from "../../assets/helpers";
import { appContext } from "../../context/MainContext";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
import es from "javascript-time-ago/locale/es.json";
TimeAgo.addLocale(es);

function Cuenta({ cuenta }) {
  const { selectCuenta, cuentaId, cuentaOcupada } = appContext();
  const {
    folio,
    orden,
    estado,
    servicio,
    _id,
    torreta,
    personas,
    createdAt,
    createdBy,
    impreso,
    bloqueado,
    cashInfo,
    obs,
    items,
  } = cuenta;

  const selectMySelf = (e, _id) => {
    e.stopPropagation();
    selectCuenta(_id);
  };

  let cancelaciones = false;
  items.map((item) => {
    if (item.cancelado) cancelaciones = true;
  });

  return (
    <div
      style={{
        pointerEvents: bloqueado ? "none" : "auto",
      }}
      onClick={(e) => selectMySelf(e, _id)}
      className="col-md-3 p-1 text-uppercase"
    >
      <div
        role="button"
        className={`card ${
          _id === cuentaId
            ? "bg-info"
            : "bg-white" && bloqueado
            ? "bg-danger"
            : "bg-white"
        } border-4`}
      >
        <div className="card-header p-1">
          <h5 className="card-title text-uppercase d-flex justify-content-between">
            <span>{servicio}</span>
            {cancelaciones && (
              <i className="bi bi-exclamation-circle text-danger"></i>
            )}
            {bloqueado && (
              <span>
                <i className="bi bi-pause-circle text-warning"></i>
              </span>
            )}
            <span className="fw-bold">Orden: {orden}</span>
          </h5>
        </div>
        <div
          className={`card-body p-2 fs-5 fw-bold text-center ${
            estado === "pendiente" ? "bg-warning" : "bg-white"
          } text-dark`}
        >
          {cuenta.servicio === "domicilio" || cuenta.servicio === "pll" ? (
            <p className="card-text m-0">
              <span>
                <i className="bi bi-person-circle me-1"></i>
              </span>
              <span>{torreta}</span>
            </p>
          ) : (
            <p className="card-text m-0 d-flex justify-content-between">
              <span>mesa: {torreta}</span>
              <span>personas: {personas}</span>
            </p>
          )}
          <p className="card-text m-0">
            <span>
              <i className="bi bi-clock me-1"></i>
            </span>
            <span>{formatearFecha(createdAt).hora}</span>
          </p>
          <p className="card-text m-0">
            <span>
              <i className="bi bi-hourglass-split"></i>
              <span>
                <ReactTimeAgo
                  date={new Date(createdAt)}
                  locale="es-MX"
                  timeStyle="facebook"
                />
              </span>
            </span>
          </p>
          <p className="card-text">
            <span className="me-1">{createdBy},</span>
            <small>folio: {folio}</small>
          </p>
        </div>
        <div className="card-footer d-flex justify-content-between py-0">
          {impreso && <i className="bi bi-printer h3"></i>}
          {obs !== "" && <i className="bi bi-chat-dots h3"></i>}
          <span className="h3"> ${cashInfo.total}</span>
        </div>
      </div>
    </div>
  );
}

export default Cuenta;
