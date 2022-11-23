import { Modal } from "react-bootstrap";
import OtrosContainer from "./otrosMedios/OtrosContainer";
import TicketsContainer from "./tickets/TicketsContainer";

function ModalConfig({ show, onHide }) {
  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-admin"
    >
      <div className="container-fluid main user-select-none">
        <div className="row">
          <div className="col-md-12 p-1 d-flex bg-success justify-content-between">
            <h3>Configuración</h3>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <nav className="col-md-12 p-1">
            <div className="nav nav-pills mb-1" role="tablist">
              <button
                className="nav-link active"
                data-bs-toggle="tab"
                data-bs-target="#tickets"
                type="button"
                role="tab"
                aria-controls="tickets"
                aria-selected="true"
              >
                Tickets
              </button>
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#otrosmedios"
                type="button"
                role="tab"
                aria-controls="otrosmedios"
                aria-selected="false"
              >
                Otros Medios
              </button>
            </div>
          </nav>
        </div>
        <div className="row">
          <div className="tab-content col-md-12 p-0">
            <div
              className="tab-pane fade show active"
              id="tickets"
              role="tabpanel"
              aria-labelledby=""
            >
              <TicketsContainer />
            </div>
            <div
              className="tab-pane fade"
              id="otrosmedios"
              role="tabpanel"
              aria-labelledby=""
            >
              <OtrosContainer />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalConfig;
