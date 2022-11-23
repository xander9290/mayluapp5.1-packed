import { Modal, Button } from "react-bootstrap";

function ModalConfirm({ show, onHide, action, msg }) {
  const execAction = () => {
    onHide();
    setTimeout(() => {
      action();
    }, 200);
  };
  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      dialogClassName="text-dark"
      size="sm"
    >
      <Modal.Header className="bg-success p-2">
        <Modal.Title className="fw-bolder">Confirmar</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white fs-5 text-uppercase p-2">
        {msg ? msg : "confirmar acción"}
      </Modal.Body>
      <Modal.Footer className="bg-success p-1">
        <Button onClick={onHide} variant="secondary">
          Cancelar
        </Button>
        <Button onClick={execAction} variant="primary">
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalConfirm;
