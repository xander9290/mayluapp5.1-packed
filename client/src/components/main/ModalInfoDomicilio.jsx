import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { appContext } from "../../context/MainContext";

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

function ModalInfoDomicilio({ show, onHide }) {
  const { cuenta, clientes } = appContext();

  const [cliente, setCliente] = useState(initialCliente);

  useEffect(() => {
    if (cuenta._id) {
      getClienteInfo();
    }
  }, [cuenta.clienteId]);

  const getClienteInfo = () => {
    const findCliente = clientes.find(
      (cliente) => cliente._id === cuenta.clienteId
    );
    if (findCliente) {
      setCliente(findCliente);
    } else {
      setCliente(initialCliente);
    }
  };

  return (
    <Modal onHide={onHide} show={show} dialogClassName="" size="md">
      <div className="card bg-white border border-success">
        <div className="card-header d-flex justify-content-between align-items-end">
          <h5 className="card-title">Información del Cliente</h5>
          <button onClick={onHide} className="btn btn-danger" type="button">
            Cerrar
            <i className="bi bi-x-circle ms-2"></i>
          </button>
        </div>
        <div className="card-body text-dark text-uppercase p-1">
          <p className="card-text fs-4 d-flex justify-content-between border-bottom border-success">
            <span>
              <b>Nombre: </b>
              {cliente.name}
            </span>
            <span>
              <b>ID: </b>
              {cliente.codigo}
            </span>
          </p>
          <p className="card-text fs-4 border-bottom border-success">
            <b>teléfono: </b>
            {cliente.tel}
          </p>
          <p className="card-text fs-4 border-bottom border-success">
            <b>calle: </b>
            {cliente.calle}
          </p>
          <p className="card-text fs-4 border-bottom border-success">
            <b>cruces: </b>
            {cliente.cruces}
          </p>
          <p className="card-text fs-4 border-bottom border-success">
            <b>colonia: </b>
            {cliente.colonia}
          </p>
          <p className="card-text fs-4 border-bottom border-success">
            <b>observaciones: </b>
            {cliente.obs}
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default ModalInfoDomicilio;
