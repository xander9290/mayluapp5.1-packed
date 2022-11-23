import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { appContext } from "../context/MainContext";

function ModalAdmin({
  show,
  onHide,
  children,
  title,
  handleShow,
  handleExited,
}) {
  const { operadores } = appContext();

  useEffect(() => {
    if (operadores.length > 0) return;
    onHide();
  }, [operadores]);
  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      dialogClassName="modal-admin"
      size="lg"
    >
      <div className="container-fluid">
        <Modal.Header className="row p-0">
          <div className="col-md-12 p-1 d-flex bg-success justify-content-between">
            <h4>{title}</h4>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </Modal.Header>
        <Modal.Body className="row p-0">{children}</Modal.Body>
      </div>
    </Modal>
  );
}

export default ModalAdmin;
