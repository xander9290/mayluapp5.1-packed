import { useRef } from "react";
import { formatearFecha } from "../../../../assets/helpers";

const initInsumo = {
  name: "",
  precio: 0,
  cantidad: 0,
  medida: "",
  stock: 0,
  createdAt: Date.now(),
  proveedor: "",
};
function FormInsumos({
  insumo,
  setInsumo,
  createInsumo,
  updateInsumo,
  almacen,
}) {
  const nameRef = useRef("");

  const handleInsumo = (e) => {
    setInsumo({ ...insumo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!almacen._id) {
      alert("Selecciona un almacén para continuar");
      return;
    }
    if (insumo._id) {
      const newBody = {
        ...insumo,
        lastEdit: Date.now(),
        stock: parseInt(insumo.stock),
      };
      updateInsumo(insumo._id, newBody);
      cancelar();
    } else {
      const newBody = {
        ...insumo,
        stock: parseInt(insumo.stock),
      };
      if (!createInsumo(newBody)) {
        alert("Nombre no disponible");
      } else {
        cancelar();
      }
    }
  };

  const cancelar = () => {
    setInsumo(initInsumo);
    nameRef.current.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="card mt-2">
      <div className="card-header p-1">
        <h5 className="card-title">Alta Insumo</h5>
      </div>
      <div className="card-body p-2">
        <div className="mb-1">
          <input
            className="form-control"
            type="text"
            name="name"
            ref={nameRef}
            value={insumo.name}
            onChange={handleInsumo}
            autoComplete="off"
            required
            placeholder="Descripción"
          />
        </div>
        <div className="mb-1 d-flex">
          <input
            className="form-control"
            type="number"
            name="cantidad"
            min="0"
            value={insumo.cantidad}
            onChange={handleInsumo}
            autoComplete="off"
            required
            placeholder="Cantidad"
          />
          <select
            className="form-select"
            name="medida"
            value={insumo.medida}
            onChange={handleInsumo}
            required
          >
            <option value="">Medida</option>
            <option value="gr">Gr</option>
            <option value="ml">Ml</option>
            <option value="kg">Kg</option>
            <option value="lt">Lt</option>
            <option value="pza">Pza</option>
          </select>
        </div>
        <div className="mb-1 d-flex">
          <div className="text-center">
            <label className="form-label">Precio Unit</label>
            <input
              className="form-control"
              type="number"
              name="precio"
              value={insumo.precio}
              onChange={handleInsumo}
              autoComplete="off"
              required
              placeholder="Cantidad"
            />
          </div>
          <div className="text-center">
            <label className="form-label">Stock Inicial</label>
            <input
              className="form-control"
              type="number"
              name="stock"
              value={insumo.stock}
              onChange={handleInsumo}
              autoComplete="off"
              placeholder="Stock inicial"
            />
          </div>
        </div>
        <button className="btn btn-primary" type="submit">
          {insumo._id ? "Editar" : "Crear"}
        </button>
        <button
          onClick={cancelar}
          className="btn btn-warning ms-1"
          type="reset"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default FormInsumos;
