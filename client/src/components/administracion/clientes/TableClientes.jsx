import { useState, useEffect, useRef } from "react";
import { appContext } from "../../../context/MainContext";

import ModalConfirm from "../../ModalConfirm";

function TableClientes({ setCliente }) {
  const { clientes, deleteCliente } = appContext();

  const buscarRef = useRef();

  const [listClientes, setListClientes] = useState([]);
  const [idx, setIdx] = useState("");
  const [buscar, setBuscar] = useState("");

  const [modalConfirm, setModalConfirm] = useState(false);

  useEffect(() => {
    setListClientes(clientes);
  }, [clientes]);

  const handleBuscar = (e) => setBuscar(e.target.value);

  const handleSubmitBuscar = (e) => {
    e.preventDefault();
    const result = clientes.filter(
      (cliente) =>
        cliente.name.toLowerCase().includes(buscar.toLocaleLowerCase()) ||
        cliente.codigo === parseInt(buscar) ||
        cliente.tel.toLowerCase().includes(buscar.toLocaleLowerCase())
    );
    if (result.length === 1) {
      const id = result[0]._id;
      setIdx(id);
      document.getElementById(id).scrollIntoView();
    } else if (result.length > 1) {
      setIdx("");
      setListClientes(result);
    } else {
      alert("cliente no encontrado".toUpperCase());
      buscarRef.current.focus();
    }
  };

  const selectCliente = (id) => {
    const findCliente = clientes.find((cliente) => cliente._id === id);
    if (findCliente) setCliente(findCliente);
  };

  const targetDeleteCliente = () => {
    setModalConfirm(true);
    setIdx("");
  };

  const actualizar = () => {
    setListClientes(clientes);
    setIdx("");
    setBuscar("");
  };

  return (
    <>
      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <form onSubmit={handleSubmitBuscar} className="d-flex">
            <input
              className="form-control"
              type="text"
              name="buscar"
              ref={buscarRef}
              value={buscar}
              onChange={handleBuscar}
              autoComplete="off"
              required
              placeholder="Buscar..."
            />
            <button title="BUSCAR" className="btn btn-primary" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>
          <button
            onClick={actualizar}
            type="button"
            className="btn btn-primary"
          >
            <i className="bi bi-arrow-repeat"></i>
            Actualizar
          </button>
        </div>
        <div
          style={{ height: "516px", overflow: "auto" }}
          className="card-body bg-white p-1"
        >
          <table className="table table-bordered text-dark">
            <thead>
              <tr className="text-center text-uppercase">
                <th scope="col">
                  <i className="bi bi-trash"></i>
                </th>
                <th scope="col">
                  <i className="bi bi-pencil"></i>
                </th>
                <th scope="col">Nombre</th>
                <th scope="col">Teléfono</th>
                <th scope="col">calle</th>
                <th scope="col">código</th>
              </tr>
            </thead>
            <tbody>
              {listClientes.map((cliente) => (
                <tr
                  id={cliente._id}
                  key={cliente._id}
                  style={{ cursor: "default" }}
                  onClick={() => setIdx(cliente._id)}
                  className={`text-uppercase ${
                    cliente._id === idx ? "bg-info" : ""
                  }`}
                >
                  <th scope="row" className="text-center">
                    <button
                      onClick={targetDeleteCliente}
                      title="ELIMINAR"
                      type="button"
                      className="btn btn-danger btn-sm"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </th>
                  <th scope="row" className="text-center">
                    <button
                      onClick={() => selectCliente(cliente._id)}
                      title="EDITAR"
                      type="button"
                      className="btn btn-primary btn-sm"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                  </th>
                  <td className="text-nowrap">{cliente.name}</td>
                  <td className="text-nowrap">{cliente.tel}</td>
                  <td className="text-nowrap">{cliente.calle}</td>
                  <td className="text-center">{cliente.codigo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ModalConfirm
        show={modalConfirm}
        onHide={() => setModalConfirm(false)}
        action={async () => deleteCliente(idx)}
      />
    </>
  );
}

export default TableClientes;
