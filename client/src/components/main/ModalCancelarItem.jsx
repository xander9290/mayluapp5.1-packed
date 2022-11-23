import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { procesarItems } from "../../assets/helpers";
import { appContext } from "../../context/MainContext";

function ModalCancelarItem({
  show,
  onHide,
  index,
  cuenta,
  updateCuenta,
  procesarCompuestos,
}) {
  const { createActividad, session } = appContext();
  const [cant, setCant] = useState(0);
  const [motivo, setMotivo] = useState("");

  const handleCant = (e) => {
    let target = e.target.value;
    if (isNaN(target) || target === "") target = 0;
    setCant(parseInt(target));
  };

  const handleMotivo = (e) => setMotivo(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const list = cuenta.items;
    const oldCantidad = list[index].cant;
    const idx = index;
    if (oldCantidad > 1) {
      const nvaCant = oldCantidad - parseInt(cant);
      list[idx].cant = nvaCant;
      const price = list[idx].price;
      const nvoImporte = price * nvaCant;
      list[idx].importe = nvoImporte;
      if (oldCantidad !== parseInt(cant)) {
        const productoCancelado = {
          ...list[idx],
          importe: list[idx].price * parseInt(cant),
          motivo,
          cancelado: true,
          cant: parseInt(cant),
          orden: cuenta.orden,
          hora: Date.now(),
        };
        list.push(productoCancelado);
      }
      list[idx].motivo = motivo;
      list[idx].hora = Date.now();
      list[idx].compuestos = procesarCompuestos(list[idx], nvaCant);
      if (nvaCant === 0) {
        list[idx].cancelado = true;
        list[idx].cant = parseInt(cant);
        list[idx].motivo = motivo;
        list[idx].hora = Date.now();
        list[idx].orden = cuenta.orden;
      }
      const { importe, totalConDscto } = procesarItems(list, cuenta.dscto);
      const newCta = {
        ...cuenta,
        items: list,
        cashInfo: {
          ...cuenta.cashInfo,
          importe,
          total: totalConDscto,
        },
      };
      const res = await updateCuenta(cuenta._id, newCta);
      if (res) {
        await createActividad(
          session.operador,
          `${session.operador} ha cancelado un producto de la orden ${cuenta.orden}`,
          "system"
        );
        onHide();
      }
    } else {
      list[idx].motivo = motivo;
      list[idx].cancelado = true;
      list[idx].orden = cuenta.orden;
      const { importe, totalConDscto } = procesarItems(list, cuenta.dscto);
      const newCta = {
        ...cuenta,
        items: list,
        cashInfo: {
          ...cuenta.cashInfo,
          importe,
          total: totalConDscto,
        },
      };
      const res = await updateCuenta(cuenta._id, newCta);
      if (res) {
        await createActividad(
          session.operador,
          `${session.operador} ha cancelado un producto de la orden ${cuenta.orden}`,
          "system"
        );
        onHide();
      }
    }
  };

  useEffect(() => {
    if (!cuenta._id) return;
    if (index === null) return;
    const listItems = cuenta.items;
    const cant = listItems[index].cant;
    setCant(cant);
  }, [index]);

  const handleShow = () => {
    setMotivo("");
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
          <h5 className="card-title text-center">Cancelar elemento</h5>
        </div>
        <div className="card-body p-1 text-dark">
          <div className="mb-1">
            <label htmlFor="cant" className="form-label">
              Cantidad:
            </label>
            <input
              className="form-control fw-bolder fs-4"
              type="text"
              name="cant"
              value={cant}
              onChange={handleCant}
              id="cant"
              autoComplete="off"
              autoFocus
              required
            />
          </div>
          <div className="mb-1">
            <label htmlFor="motivo" className="form-label">
              Motivo:
            </label>
            <input
              className="form-control"
              type="text"
              name="motivo"
              value={motivo}
              onChange={handleMotivo}
              id="motivo"
              autoComplete="off"
              required
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

export default ModalCancelarItem;
