import { useRef, useState } from "react";
import { formatearFecha } from "../../../assets/helpers";
import { appContext } from "../../../context/MainContext";

const initialCaja = {
  tipo: "",
  concepto: "",
  importe: 0,
  createdBy: "",
};
const initialImporte = {
  importe: 0,
};
function FormCaja({ setXcaja }) {
  const { createCaja, session, abrirCajon } = appContext();

  const importeRef = useRef();

  const [caja, setCaja] = useState(initialCaja);
  const [importe, setImporte] = useState(initialImporte);

  const handleCaja = (e) =>
    setCaja({ ...caja, [e.target.name]: e.target.value });

  const handleImporte = (e) => {
    let value = e.target.value;
    if (isNaN(value) || value === "") value = 0;
    setImporte({ ...importe, [e.target.name]: parseInt(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (importe.importe === 0) {
      importeRef.current.select();
      return;
    }
    const newCaja = {
      ...caja,
      ...importe,
      createdBy: session.operador,
      fecha: formatearFecha(Date.now()).fecha,
    };
    const res = await createCaja(newCaja);
    if (res.res) {
      setCaja(initialCaja);
      setImporte(initialImporte);
      setXcaja(res.data);
      await abrirCajon();
    }
  };

  const cancelar = () => {
    setCaja(initialCaja);
    setImporte(initialImporte);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="card-header p-1">
        <h5 className="card-title">Retiros y Depósitos</h5>
      </div>
      <div className="card-body p-1">
        <div className="mb-2">
          <select
            name="tipo"
            value={caja.tipo}
            onChange={handleCaja}
            className="form-select form-select-lg fw-bold"
            required
          >
            <option value="">Tipo</option>
            <option value="retiro" className="h3">
              Retiro
            </option>
            <option value="deposito" className="h3">
              Depósito
            </option>
          </select>
        </div>
        <div className="mb-2">
          <input
            type="text"
            name="concepto"
            value={caja.concepto}
            onChange={handleCaja}
            placeholder="Concepto"
            required
            autoComplete="off"
            className="form-control form-control-lg"
          />
        </div>
        <div className="mb-2">
          <div className="input-group input-group-lg">
            <span className="input-group-text">$</span>
            <input
              type="text"
              name="importe"
              ref={importeRef}
              value={importe.importe}
              onChange={handleImporte}
              placeholder="Importe"
              required
              className="form-control form-control-lg"
            />
            <span className="input-group-text">.00</span>
          </div>
        </div>
      </div>
      <div className="card-footer p-1">
        <button title="AGREGAR" className="btn btn-primary me-2" type="submit">
          <i className="bi bi-plus-circle me-2"></i>
          Guardar
        </button>
        <button
          onClick={cancelar}
          title="CANCELAR"
          className="btn btn-warning"
          type="reset"
        >
          <i className="bi bi-x-circle me-2"></i>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default FormCaja;
