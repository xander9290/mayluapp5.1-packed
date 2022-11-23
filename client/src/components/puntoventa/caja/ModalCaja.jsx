import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import FormCaja from "./FormCaja";
import TableCaja from "./TableCaja";
import TicketCaja from "./TicketCaja";

const initialCaja = {
  tipo: "",
  concepto: "",
  importe: 0,
  createdBy: "",
};
function ModalCaja({ show, onHide }) {
  const [xcaja, setXcaja] = useState(initialCaja);

  const [cajaTicket, setCajaTicket] = useState(false);

  useEffect(() => {
    if (xcaja._id) {
      setCajaTicket(true);
    }
  }, [xcaja]);
  const handleShow = () => {};
  const handleExited = () => {
    setXcaja(initialCaja);
  };

  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      dialogClassName="caja-modal"
    >
      <div className="container-fluid bg-dark user-select-none main">
        <div className="row">
          <div className="col-md-12 p-1 d-flex justify-content-between bg-success">
            <h3>Movimientos en Caja</h3>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 p-1">
            <FormCaja initialCaja={initialCaja} setXcaja={setXcaja} />
          </div>
          <div className="col-md-9 p-1">
            <TableCaja setXcaja={setXcaja} />
          </div>
        </div>
      </div>
      <TicketCaja
        show={cajaTicket}
        onHide={() => setCajaTicket(false)}
        caja={xcaja}
        initialCaja={initialCaja}
        setCaja={setXcaja}
      />
    </Modal>
  );
}

export default ModalCaja;
