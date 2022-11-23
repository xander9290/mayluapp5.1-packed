import { formatearFecha } from "../../../assets/helpers";
import { appContext } from "../../../context/MainContext";

function FormClientes({ cliente, setCliente, initialCliente }) {
  const { clientes, createCliente, updateCliente, session } = appContext();

  const handleCliente = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cliente._id) {
      const newCliente = {
        ...cliente,
        lastEdit: Date.now(),
      };
      await updateCliente(cliente._id, newCliente);
      cancelar();
    } else {
      const newCliente = {
        ...cliente,
        createdBy: session.operador,
      };
      await createCliente(newCliente);
      cancelar();
    }
  };

  const cancelar = () => {
    setCliente(initialCliente);
  };

  return (
    <form onSubmit={handleSubmit} className="card user-select-none">
      <div className="card-header">
        <h5 className="card-title">
          Clientes <span className="badge bg-primary">{clientes.length}</span>
          {cliente._id && "<Modo Edición>"}
        </h5>
      </div>
      <div className="card-body">
        <div className="mb-2">
          <label className="label-form fs-5">Contacto</label>
          <input
            className="form-control mb-1"
            type="text"
            name="name"
            value={cliente.name}
            onChange={handleCliente}
            autoComplete="off"
            required
            placeholder="Nombre"
          />
          <input
            className="form-control"
            type="text"
            name="tel"
            value={cliente.tel}
            onChange={handleCliente}
            autoComplete="off"
            required
            placeholder="Teléfono"
          />
        </div>
        <div className="mb-3">
          <label className="label-form fs-5">Dirección</label>
          <input
            className="form-control mb-1"
            type="text"
            name="calle"
            value={cliente.calle}
            onChange={handleCliente}
            autoComplete="out"
            required
            placeholder="Calle y Número"
          />
          <input
            className="form-control mb-1"
            type="text"
            name="cruces"
            value={cliente.cruces}
            onChange={handleCliente}
            autoComplete="no"
            required
            placeholder="Cruces"
          />
          <input
            className="form-control mb-1"
            type="text"
            name="colonia"
            value={cliente.colonia}
            onChange={handleCliente}
            autoComplete="off"
            placeholder="Colonia"
          />
          <textarea
            className="form-control"
            name="obs"
            value={cliente.obs}
            onChange={handleCliente}
            rows="2"
            placeholder="Observaciones"
          ></textarea>
        </div>
        <div className="mb-2">
          {cliente._id ? (
            <button title="EDITAR" className="btn btn-primary" type="submit">
              <i className="bi bi-pencil me-2"></i>
              Editar
            </button>
          ) : (
            <button title="AGREGAR" className="btn btn-primary" type="submit">
              <i className="bi bi-plus-circle me-2"></i>
              Guardar
            </button>
          )}
          <button
            onClick={cancelar}
            title="CANCELAR"
            className="btn btn-warning ms-2"
            type="reset"
          >
            <i className="bi bi-x-circle me-2"></i>
            Cancelar
          </button>
        </div>
      </div>
      <div className="card-footer">
        <p className="p-0 m-0">
          <span className="fw-bolder">Creación: </span>
          <span>
            {cliente.createdAt && formatearFecha(cliente.createdAt).fechaHora}
          </span>
        </p>
        <p className="p-0 m-0">
          <span className="fw-bolder">Creado por: </span>
          <span>{cliente.createdBy}</span>
        </p>
        <p className="p-0 m-0">
          <span className="fw-bolder">Última edición: </span>
          <span>
            {cliente.lastEdit && formatearFecha(cliente.lastEdit).fechaHora}
          </span>
        </p>
      </div>
    </form>
  );
}

export default FormClientes;
