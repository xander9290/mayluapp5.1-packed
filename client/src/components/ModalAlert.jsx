import { Modal, Button } from "react-bootstrap";

function ModalAlert({ show, onHide, msg }) {
  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      dialogClassName="text-dark"
      size="sm"
    >
      <Modal.Header className="bg-warning p-2 text-uppercase">
        <Modal.Title className="fw-bold">
          <i className="bi bi-exclamation-circle me-2"></i>
          Atención
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white fs-5 text-center text-uppercase p-2">
        {msg}
      </Modal.Body>
      <Modal.Footer className="bg-warning p-1">
        <Button onClick={onHide} variant="primary">
          Entendido
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAlert;
