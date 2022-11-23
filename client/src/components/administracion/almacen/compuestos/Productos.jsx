import { useState } from "react";

function Productos({
  productos,
  setProducto,
  subcategorias,
  selectedCompuestos,
  setSelectedCompuestos,
  deleteSelectedCompuesto,
  targetActualizarProducto,
  limpiar,
}) {
  const [productosList, setProductosList] = useState([]);
  const [idx, setIdx] = useState("");

  const handleSubcategoria = (e) => {
    const value = e.target.value;
    if (!value) {
      setProductosList([]);
      return;
    }
    const getProductos = productos.filter(
      (producto) => producto.subcategoriaId === value
    );

    if (getProductos.length > 0) {
      setProductosList(getProductos);
    }
  };

  const handleProducto = (e) => {
    const value = e.target.value;
    if (!value) {
      setProducto({});
      return;
    }

    const getProducto = productos.find((producto) => producto._id === value);
    if (getProducto) {
      setProducto(getProducto);
      setSelectedCompuestos(getProducto.compuestos);
    }
  };

  const guardar = () => {
    if (targetActualizarProducto()) {
      cancelar();
    }
  };

  const cancelar = () => {
    limpiar();
    setProductosList([]);
  };
  return (
    <div className="card">
      <div className="card-header p-2">
        <form className="d-flex">
          <select
            className="form-select text-uppercase fw-bold"
            name="subcategoria"
            onChange={handleSubcategoria}
          >
            <option value="">Subcategoría</option>
            {subcategorias.map((sub) => (
              <option
                className="h5 text-uppercase"
                key={sub._id}
                value={sub._id}
              >
                {sub.name}
              </option>
            ))}
          </select>
        </form>
        <form className="d-flex">
          <select
            className="form-select text-uppercase fw-bold"
            name="producto"
            onChange={handleProducto}
          >
            <option value="">Producto</option>
            {productosList.map((producto) => (
              <option
                className="h5 text-uppercase"
                key={producto._id}
                value={producto._id}
              >
                {producto.name}
              </option>
            ))}
          </select>
        </form>
      </div>
      <div
        style={{ height: "393px", overflowY: "auto" }}
        className="card-body p-0 bg-white"
      >
        <table className="table table-bordered text-dark">
          <thead>
            <tr className="text-center text-uppercase">
              <th scope="col">
                <i className="bi bi-trash"></i>
              </th>
              <th className="text-start" scope="col">
                Descripción
              </th>
              <th scope="col">Costo</th>
            </tr>
          </thead>
          <tbody>
            {selectedCompuestos.map((compuesto) => (
              <tr
                key={compuesto._id}
                id={compuesto._id}
                style={{ cursor: "default" }}
                onClick={() => setIdx(compuesto._id)}
                className={`text-uppercase ${
                  compuesto._id === idx ? "bg-info" : ""
                }`}
              >
                <th scope="row" className="text-center">
                  <button
                    onClick={() => deleteSelectedCompuesto(compuesto._id)}
                    title="ELIMINAR"
                    type="button"
                    className="btn btn-danger btn-sm"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </th>
                <td className=" text-nowrap align-middle">{compuesto.name}</td>
                <td className="text-nowrap text-end align-middle">
                  ${compuesto.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-footer p-2 d-flex justify-content-between align-items-end">
        <div>
          <button onClick={guardar} type="button" className="btn btn-primary">
            Guardar
          </button>
          <button
            onClick={cancelar}
            type="button"
            className="btn btn-warning ms-1"
          >
            Cancelar
          </button>
        </div>
        <span className="fs-5">
          $
          {selectedCompuestos
            .reduce((sum, i) => sum + parseFloat(i.price), 0)
            .toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default Productos;
