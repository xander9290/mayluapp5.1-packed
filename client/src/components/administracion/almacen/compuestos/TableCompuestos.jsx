import { useState, useEffect } from "react";

function TableCompuestos({
  compuestos,
  categorias,
  deleteCompuesto,
  setCompuesto,
  targetSelectCompuesto,
}) {
  const [buscar, setBuscar] = useState({ name: "", categoriaId: "" });
  const [listCompuestos, setListCompuestos] = useState([]);
  const [idx, setIdx] = useState("");

  useEffect(() => {
    setListCompuestos(compuestos);
  }, [compuestos]);

  const handleBuscar = (e) => {
    setBuscar({ ...buscar, [e.target.name]: e.target.value });
    console.log({ ...buscar, [e.target.name]: e.target.value });
  };

  const handleSubmitBuscar = (e) => {
    e.preventDefault();
    if (buscar.name !== "") {
      const result = compuestos.filter((compuesto) =>
        compuesto.name.toLowerCase().includes(buscar.name.toLocaleLowerCase())
      );
      const id = result[0]._id;
      setIdx(id);
      document.getElementById(id).scrollIntoView();
    } else {
      const result = compuestos.filter(
        (compuesto) => compuesto.categoriaId === buscar.categoriaId
      );
      setIdx("");
      setListCompuestos(result);
    }
    console.log(result);
    // if (result.length === 1) {
    //   const id = result[0]._id;
    //   setIdx(id);
    //   document.getElementById(id).scrollIntoView();
    // } else if (result.length > 1) {
    //   setIdx("");
    //   setListCompuestos(result);
    // } else {
    //   alert("Compuesto no encontrado".toUpperCase());
    // }
  };

  const targetDeleteCompuesto = (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    deleteCompuesto(id);
  };

  const targetEditCompuesto = (compuesto) => {
    setCompuesto(compuesto);
  };

  const actualizar = () => {
    setListCompuestos(compuestos);
    setIdx("");
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between">
        <button
          onClick={actualizar}
          type="button"
          className="btn btn-success text-dark"
        >
          <i className="bi bi-arrow-repeat me-2"></i>
          Actualizar
        </button>
        <form onSubmit={handleSubmitBuscar} className="d-flex">
          <input
            className="form-control"
            type="text"
            name="name"
            value={buscar.name}
            onChange={handleBuscar}
            autoComplete="off"
            placeholder="Descripción"
          />
          <select
            className="form-select"
            name="categoriaId"
            onChange={handleBuscar}
            value={buscar.categoriaId}
          >
            <option value="">Categoría</option>
            {categorias.map((cat) => (
              <option
                className="h5 text-uppercase"
                key={cat._id}
                value={cat._id}
              >
                {cat.name}
              </option>
            ))}
          </select>
          <button title="BUSCAR" className="btn btn-primary" type="submit">
            <i className="bi bi-search"></i>
          </button>
        </form>
      </div>
      <div
        style={{ height: "430px", overflow: "auto" }}
        className="card-body p-0 bg-white"
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
              <th scope="col">
                <i className="bi bi-arrow-right-square"></i>
              </th>
              <th scope="col">Descripción</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Costo</th>
              <th scope="col">Rendimiento</th>
              <th scope="col">Insumo</th>
            </tr>
          </thead>
          <tbody>
            {listCompuestos.map((compuesto) => (
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
                    onClick={() => targetDeleteCompuesto(compuesto._id)}
                    title="ELIMINAR"
                    type="button"
                    className="btn btn-danger btn-sm"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </th>
                <th scope="row" className="text-center">
                  <button
                    onClick={() => targetEditCompuesto(compuesto)}
                    title="EDITAR"
                    type="button"
                    className="btn btn-primary btn-sm"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </th>
                <th scope="row" className="text-center">
                  <button
                    onClick={() => targetSelectCompuesto(compuesto)}
                    title="SELECCIONAR"
                    type="button"
                    className="btn btn-dark btn-sm"
                  >
                    <i className="bi bi-arrow-right-square"></i>
                  </button>
                </th>
                <td className=" text-nowrap align-middle">{compuesto.name}</td>
                <td className="text-nowrap text-center align-middle">
                  {compuesto.cantidad} {compuesto.medida}
                </td>
                <td className="text-nowrap text-end align-middle">
                  ${compuesto.price}
                </td>
                <td className="text-nowrap text-center align-middle">
                  {compuesto.rendimiento} {"unidad(es)"}
                </td>
                <td className="text-nowrap text-center align-middle">
                  {compuesto.insumoCantidad} {compuesto.medida} $
                  {compuesto.insumoPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-footer p-1">
        <p>...</p>
      </div>
    </div>
  );
}

export default TableCompuestos;
