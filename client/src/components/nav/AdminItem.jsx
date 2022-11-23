import { useState } from "react";
import { appContext } from "../../context/MainContext";
import ModalAlmacen from "../administracion/almacen/ModalAlmacen";
import ModalClientes from "../administracion/clientes/ModalClientes";
import ModalConfig from "../administracion/configuracion/ModalConfig";
import Operadores from "../administracion/operadores/Operadores";
import ModalAdmin from "../ModalAdmin";

function AdminItem() {
  const { session } = appContext();

  const [modalClientes, setModalClientes] = useState(false);
  const [modalOperadores, setModalOperadores] = useState(false);
  const [modalAlmacen, setModalAlmacen] = useState(false);
  const [modalConfig, setModalConfig] = useState(false);

  const targetModalAlmacen = () => {
    setModalAlmacen(true);
  };

  const targetModalClientes = () => {
    setModalClientes(true);
  };

  const targetModalOperadores = () => {
    setModalOperadores(true);
  };

  const targetModalConfig = () => {
    setModalConfig(true);
  };

  return (
    <>
      <li className="nav-item dropdown">
        <a
          disabled={session.rol === "master" ? false : true}
          href="#"
          className="nav-link dropdown-toggle fs-5 text-dark"
          data-bs-toggle="dropdown"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Administración
        </a>
        <div className="dropdown-menu">
          <a
            onClick={targetModalAlmacen}
            href="#"
            className="dropdown-item fs-5 py-2"
          >
            Almacén
          </a>
          <a
            onClick={targetModalClientes}
            href="#"
            className="dropdown-item fs-5 py-2"
          >
            Clientes
          </a>
          <a
            onClick={targetModalOperadores}
            href="#"
            className="dropdown-item fs-5 py-2"
          >
            Operadores
          </a>
          <a
            onClick={targetModalConfig}
            href="#"
            className="dropdown-item fs-5 py-2"
          >
            Configuración
          </a>
        </div>
      </li>
      <ModalAlmacen show={modalAlmacen} onHide={() => setModalAlmacen(false)} />
      <ModalClientes
        show={modalClientes}
        onHide={() => setModalClientes(false)}
      />
      <Operadores
        show={modalOperadores}
        onHide={() => setModalOperadores(false)}
      />
      <ModalConfig show={modalConfig} onHide={() => setModalConfig(false)} />
    </>
  );
}

export default AdminItem;
