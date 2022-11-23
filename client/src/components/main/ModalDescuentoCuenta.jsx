import { useState } from "react";
import { Modal } from "react-bootstrap";
import { procesarItems } from "../../assets/helpers";

function ModalDescuentoCuenta({ show, onHide, cuenta, updateCuenta }) {
  const [dscto, setDscto] = useState(0);

  const handleDscto = (e) => {
    let target = e.target.value;
    if (isNaN(target) || target === "") target = 0;
    setDscto(parseInt(target));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { totalConDscto } = procesarItems(cuenta.items, parseInt(dscto));
    const newCta = {
      ...cuenta,
      cashInfo: {
        ...cuenta.cashInfo,
        dscto: parseInt(dscto),
        total: totalConDscto,
      },
    };
    const res = await updateCuenta(cuenta._id, newCta);
    if (res) onHide();
  };

  const handleShow = () => {
    setDscto(0);
  };

  return (
    <Modal
      onHide={onHide}
      show={show}
      onShow={handleShow}
      backdrop="static"
      keyboard={false}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="card bg-success">
        <div className="card-header">
          <h5 className="card-title text-center">Descuento a cuenta</h5>
        </div>
        <div className="card-body p-1 text-dark">
          <div className="mb-1">
            <label htmlFor="dscto" className="form-label">
              Importe en porcentaje %
            </label>
            <input
              className="form-control fw-bolder fs-4"
              type="text"
              name="dscto"
              value={dscto}
              onChange={handleDscto}
              id="dscto"
              required
              autoFocus
              autoComplete="off"
            />
          </div>
        </div>
        <div className="card-footer p-2 text-end">
          <button
            onClick={onHide}
            className="btn btn-light text-dark"
            type="reset"
          >
            Cancelar
          </button>
          <button className="btn btn-primary ms-2" type="submit">
            Aceptar
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalDescuentoCuenta;
