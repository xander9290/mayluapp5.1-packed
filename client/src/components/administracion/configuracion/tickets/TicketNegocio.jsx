import { useState, useEffect } from "react";
import { appContext } from "../../../../context/MainContext";
import ModalConfirm from "../../../ModalConfirm";

const initAreas = { area1: true, area2: true, area3: true, area4: true };
const initTotal = {
  subtotal: true,
  descuento: true,
  total: true,
  efectivo: true,
  tarjeta: true,
  cambio: true,
};
function TicketNegocio() {
  const { changeNotaNegocioSettings } = appContext();

  const [checkNegocioAreas, setCheckNegocioAreas] = useState(initAreas);
  const [checkNegocioTotal, setCheckNegocioTotal] = useState(initTotal);

  const [modalConfirm, setModalConfirm] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("settings")) {
      const parseSettings = JSON.parse(localStorage.getItem("settings"));
      setCheckNegocioAreas({ ...parseSettings.notaNegocio.areasVisibles });
      setCheckNegocioTotal({ ...parseSettings.notaNegocio.totalInfo });
    }
  }, []);

  const handleCheckNegocioAreas = (e) => {
    setCheckNegocioAreas({
      ...checkNegocioAreas,
      [e.target.name]: e.target.checked,
    });
  };

  const handleCheckNegocioTotal = (e) => {
    setCheckNegocioTotal({
      ...checkNegocioTotal,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmitNegocio = (e) => {
    e.preventDefault();
    setModalConfirm(true);
  };

  const changeSettings = () => {
    const newSettings = {
      areasVisibles: checkNegocioAreas,
      totalInfo: checkNegocioTotal,
    };
    changeNotaNegocioSettings(newSettings);
  };

  return (
    <>
      <form className="card" onSubmit={handleSubmitNegocio}>
        <div className="card-header">Ticket Negocio</div>
        <div
          style={{ height: "450px", overflowY: "auto" }}
          className="card-body p-1"
        >
          <fieldset>
            <div className="mb-2">
              <h5>Áreas Visibles</h5>
              <div className="form-check form-check-inline form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="area1"
                  checked={checkNegocioAreas.area1}
                  onChange={handleCheckNegocioAreas}
                />
                <label>Area 1</label>
              </div>
              <div className="form-check form-check-inline form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="area2"
                  checked={checkNegocioAreas.area2}
                  onChange={handleCheckNegocioAreas}
                />
                <label>Area 2</label>
              </div>
              <div className="form-check form-check-inline form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="area3"
                  checked={checkNegocioAreas.area3}
                  onChange={handleCheckNegocioAreas}
                />
                <label>Area 3</label>
              </div>
              <div className="form-check form-check-inline form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="area4"
                  checked={checkNegocioAreas.area4}
                  onChange={handleCheckNegocioAreas}
                />
                <label>Area 4</label>
              </div>
            </div>
            <div className="mb-2">
              <h5>Información Totales</h5>
              <div className="form-check form-check-inline form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="subtotal"
                  checked={checkNegocioTotal.subtotal}
                  onChange={handleCheckNegocioTotal}
                />
                <label>Subtotal</label>
              </div>
              <div className="form-check form-check-inline form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="descuento"
                  checked={checkNegocioTotal.descuento}
                  onChange={handleCheckNegocioTotal}
                />
                <label>Descuento</label>
              </div>
              <div className="form-check form-check-inline form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="total"
                  checked={checkNegocioTotal.total}
                  onChange={handleCheckNegocioTotal}
                />
                <label>Total</label>
              </div>
              <div className="form-check form-check-inline form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="efectivo"
                  checked={checkNegocioTotal.efectivo}
                  onChange={handleCheckNegocioTotal}
                />
                <label>Efectivo</label>
              </div>
              <div className="form-check form-check-inline form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="tarjeta"
                  checked={checkNegocioTotal.tarjeta}
                  onChange={handleCheckNegocioTotal}
                />
                <label>Tarjeta</label>
              </div>
              <div className="form-check form-check-inline form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="cambio"
                  checked={checkNegocioTotal.cambio}
                  onChange={handleCheckNegocioTotal}
                />
                <label>Cambio</label>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="card-footer p-1 text-end">
          <button className="btn btn-primary" type="submit">
            Guardar
          </button>
        </div>
      </form>
      <ModalConfirm
        action={changeSettings}
        show={modalConfirm}
        onHide={() => setModalConfirm(false)}
      />
    </>
  );
}

export default TicketNegocio;
