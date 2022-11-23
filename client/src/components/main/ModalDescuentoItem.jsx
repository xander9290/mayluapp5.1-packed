import { useState } from "react";
import { Modal } from "react-bootstrap";
import { procesarItems } from "../../assets/helpers";
import { appContext } from "../../context/MainContext";

function ModalDescuentoItem({ show, onHide, index, cuenta, updateCuenta }) {
  const { createActividad, session } = appContext();
  const [dscto, setDscto] = useState(0);
  const [msj, setMsj] = useState(false);

  const handleDscto = (e) => {
    let target = e.target.value;
    if (isNaN(target) || target === "") target = 0;
    setDscto(parseInt(target));
    setMsj(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dscto <= 0) return;
    const idx = index;
    const list = cuenta.items;
    if (list[idx].dscto > 0) {
      setMsj(true);
      return;
    }
    const oldImporte = list[idx].importe;
    const total = Math.round((oldImporte * dscto) / 100);
    const totalDscto = oldImporte - total;
    list[idx].importe = totalDscto;
    list[idx].dscto = total;
    const { importe, totalConDscto } = procesarItems(list, 0);
    const newCta = {
      ...cuenta,
      items: list,
      cashInfo: {
        ...cuenta.cashInfo,
        importe,
        dscto: 0,
        total: totalConDscto,
      },
    };
    const res = await updateCuenta(cuenta._id, newCta);
    if (res) {
      await createActividad(
        session.operador,
        `${session.operador} ha aplicado descuento a producto de la orden ${cuenta.orden}`,
        "system"
      );
      onHide();
    }
  };

  const handleShow = () => {
    setDscto(0);
    setMsj(false);
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
          <h5 className="card-title text-center">Descuento a elemento</h5>
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
        {msj && (
          <div className="bg-warning text-dark fs-5 fw-bold border border-2 border-danger text-uppercase text-center rounded">
            un descuento por elemento(s) permitido solamente
          </div>
        )}
      </form>
    </Modal>
  );
}

export default ModalDescuentoItem;
