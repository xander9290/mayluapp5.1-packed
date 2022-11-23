function BtnImprimir({
  cuenta,
  targetModalTicketNegocio,
  targetModalTicketCliente,
}) {
  return (
    <div className="btn-group dropstart">
      <button
        disabled={cuenta._id ? false : true}
        type="button"
        className="btn btn-success dropdown-toggle text-uppercase btn-lg fw-bold text-dark py-3 fs-4 mt-1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        imprimir
      </button>
      <div className="dropdown-menu text-uppercase">
        <a
          onClick={targetModalTicketNegocio}
          href="#"
          className="dropdown-item fs-4 py-2"
        >
          negocio
        </a>
        <a
          onClick={targetModalTicketCliente}
          href="#"
          className="dropdown-item fs-4 py-2"
        >
          cliente
        </a>
      </div>
    </div>
  );
}

export default BtnImprimir;
