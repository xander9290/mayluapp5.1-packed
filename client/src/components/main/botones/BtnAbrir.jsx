function BtnAbrir({
  targetModalComedor,
  targetModalParallevar,
  targetModalDomicilio,
}) {
  return (
    <>
      <div className="btn-group dropstart">
        <button
          type="button"
          className="btn btn-success dropdown-toggle text-uppercase fw-bold text-dark py-3 fs-4"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          abrir <i className="bi bi-file-earmark-plus"></i>
        </button>
        <div className="dropdown-menu text-uppercase">
          <a
            onClick={targetModalComedor}
            href="#"
            className="dropdown-item fs-4 py-2"
          >
            <i className="bi bi-bounding-box-circles me-2"></i>
            comedor
          </a>
          <a
            onClick={targetModalParallevar}
            href="#"
            className="dropdown-item fs-4 py-2"
          >
            <i className="bi bi-bag me-2"></i>
            para llevar
          </a>
          <a
            onClick={targetModalDomicilio}
            href="#"
            className="dropdown-item fs-4 py-2"
          >
            <i className="bi bi-house-door me-2"></i>
            domicilio
          </a>
        </div>
      </div>
    </>
  );
}

export default BtnAbrir;
