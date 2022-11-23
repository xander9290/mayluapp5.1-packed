import { useState } from "react";
import { Modal } from "react-bootstrap";
import { appContext } from "../../../context/MainContext";
import Clock from "../../nav/Clock";
import FormClientes from "./FormClientes";
import TableClientes from "./TableClientes";

const initialCliente = {
  name: "",
  tel: "",
  calle: "",
  cruces: "",
  colonia: "",
  obs: "",
  codigo: null,
  lastEdit: "",
};
function ModalClientes({ show, onHide }) {
  const [cliente, setCliente] = useState(initialCliente);

  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      <div className="container-fluid main">
        <div className="row">
          <div className="col-md-12 bg-success p-1 d-flex justify-content-between">
            <h3>Clientes</h3>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 p-1">
            <FormClientes
              cliente={cliente}
              setCliente={setCliente}
              initialCliente={initialCliente}
            />
          </div>
          <div className="col-md-8 p-1">
            <TableClientes setCliente={setCliente} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalClientes;
