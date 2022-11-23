import { useState, useEffect } from "react";
import { verifyExiste } from "../../../../assets/helpers";

const initInsumo = {
  insumoCantidad: 0,
  insumoId: null,
  insumoPrice: 0,
};
const initValues = {
  name: "",
  cantidad: 0,
  price: 0,
  rendimiento: 0,
  medida: "",
};
function FormCompuestos({
  almacenes,
  compuesto,
  compuestos,
  setCompuesto,
  categorias,
  createCompuesto,
  updateCompuesto,
  session,
}) {
  const [insumos, setInsumos] = useState([]);
  const [insumo, setInsumo] = useState(initInsumo);
  const [categoriaId, setCategoriaId] = useState("");
  const [values, setValues] = useState(initValues);

  useEffect(() => {
    if (!compuesto._id) return;
    const {
      name,
      cantidad,
      medida,
      price,
      rendimiento,
      insumoId,
      insumoCantidad,
      insumoPrice,
      categoriaId,
      _id,
    } = compuesto;
    setValues({ name, cantidad, medida, rendimiento, price, _id });
    setInsumo({ insumoId, insumoCantidad, insumoPrice });
    setCategoriaId(categoriaId);
  }, [compuesto]);

  const handleAlmacen = (e) => {
    let value = e.target.value;
    if (!value) {
      setInsumos([]);
      return;
    }
    const almacen = almacenes.find((almacen) => almacen._id === value);
    if (almacen) setInsumos(almacen.insumos);
  };

  const handleInsumo = (e) => {
    const value = e.target.value;
    if (!value) {
      setInsumo(initInsumo);
      return;
    }
    const findInsumo = insumos.find((insumo) => insumo._id === value);
    if (findInsumo)
      setInsumo({
        insumoCantidad: parseInt(findInsumo.cantidad),
        insumoId: findInsumo._id,
        insumoPrice: parseInt(findInsumo.precio),
      });
  };

  const handleCategoria = (e) => {
    const value = e.target.value;
    if (!value) {
      categoriaId(null);
      return;
    }
    setCategoriaId(value);
  };

  const handleValues = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valor =
      (parseFloat(values.cantidad) * insumo.insumoPrice) /
      insumo.insumoCantidad;

    const rendimiento =
      parseInt(insumo.insumoCantidad) / parseInt(values.cantidad);

    const newBody = {
      ...values,
      ...insumo,
      categoriaId,
      price: valor.toFixed(2),
      rendimiento: Math.round(rendimiento),
      createdBy: session.operador,
    };
    if (values._id) {
      updateCompuesto(values._id, newBody);
    } else {
      if (verifyExiste(compuestos, values.name.toLowerCase().trim())) {
        alert("Nombre no disponible");
        return;
      }
      createCompuesto(newBody);
    }
    reiniciar();
    e.target.reset();
  };

  const reiniciar = () => {
    setValues(initValues);
    setInsumo(initInsumo);
    setInsumos([]);
    setCategoriaId("");
    setCompuesto({ ...initValues, ...initInsumo, categoriaId });
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="card-header">
        <h5 className="card-title">Alta de compuesto</h5>
      </div>
      <div className="card-body">
        <div className="mb-1">
          <input
            className="form-control"
            type="text"
            name="name"
            value={values.name}
            onChange={handleValues}
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
            value={values.cantidad}
            onChange={handleValues}
            autoComplete="off"
            placeholder="Cantidad"
          />
          <select
            className="form-select"
            name="medida"
            value={values.medida}
            onChange={handleValues}
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
        <div className="mb-1">
          <select className="form-select" onChange={handleAlmacen} required>
            <option value="">Almacén</option>
            {almacenes.map((almacen) => (
              <option
                className="h4 text-uppercase"
                key={almacen._id}
                value={almacen._id}
              >
                {almacen.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-1">
          <select className="form-select" onChange={handleInsumo} required>
            <option value="">Insumo</option>
            {insumos.map((insumo) => (
              <option
                className="h5 text-uppercase"
                key={insumo._id}
                value={insumo._id}
              >
                {insumo.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <select
            className="form-select"
            value={categoriaId}
            onChange={handleCategoria}
            required
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
        </div>
        <button className="btn btn-primary" type="submit">
          {values._id ? "Editar" : "Crear"}
        </button>
        <button
          onClick={reiniciar}
          className="btn btn-warning ms-2"
          type="reset"
        >
          Cancelar
        </button>
      </div>
      <div className="card-footer p-1"></div>
    </form>
  );
}

export default FormCompuestos;
