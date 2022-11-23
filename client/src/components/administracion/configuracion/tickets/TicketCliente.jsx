import { useState, useEffect } from "react";
import { appContext } from "../../../../context/MainContext";
import ModalConfirm from "../../../ModalConfirm";

const initValues = {
  logoTitle: "",
  logoSubtitle: "",
  infoAddress1: "",
  infoAddress2: "",
  infoAddress3: "",
  infoTel: "",
  infoWapp: "",
  footerMsg1: "",
  footerMsg2: "",
  footerMsg3: "",
};
function TicketCliente() {
  const { changeNotaClienteSettings } = appContext();

  const [values, setValues] = useState(initValues);
  const [modalConfirm, setModalConfirm] = useState(false);

  const handleValues = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setModalConfirm(true);
  };

  const changeSettings = () => {
    changeNotaClienteSettings(values);
  };

  useEffect(() => {
    if (localStorage.getItem("settings")) {
      const parseSettings = JSON.parse(localStorage.getItem("settings"));
      setValues({ ...parseSettings.notaCliente });
    }
  }, []);

  return (
    <>
      <form className="card" onSubmit={handleSubmit}>
        <div className="card-header">Ticket Cliente</div>
        <div
          style={{ height: "450px", overflowY: "auto" }}
          className="card-body p-1"
        >
          <fieldset>
            <div className="mb-2">
              <h5>Logotipo</h5>
              <label>Título de logotipo</label>
              <input
                type="text"
                className="form-control"
                name="logoTitle"
                value={values.logoTitle}
                onChange={handleValues}
                autoComplete="off"
              />
              <label>Subtítulo de logotipo</label>
              <input
                type="text"
                className="form-control"
                name="logoSubtitle"
                value={values.logoSubtitle}
                onChange={handleValues}
                autoComplete="off"
              />
            </div>
            <div className="mb-2">
              <h5>Dirección y Contacto</h5>
              <label>Dirección 1</label>
              <input
                type="text"
                className="form-control"
                name="infoAddress1"
                value={values.infoAddress1}
                onChange={handleValues}
                autoComplete="off"
              />
              <label>Dirección 2</label>
              <input
                type="text"
                className="form-control"
                name="infoAddress2"
                value={values.infoAddress2}
                onChange={handleValues}
                autoComplete="off"
              />
              <label>Dirección 3</label>
              <input
                type="text"
                className="form-control"
                name="infoAddress3"
                value={values.infoAddress3}
                onChange={handleValues}
                autoComplete="off"
              />
              <label>Teléfono(s)</label>
              <input
                type="text"
                className="form-control"
                name="infoTel"
                value={values.infoTel}
                onChange={handleValues}
                autoComplete="off"
              />
              <label>WhatsApp</label>
              <input
                type="text"
                className="form-control"
                name="infoWapp"
                value={values.infoWapp}
                onChange={handleValues}
                autoComplete="off"
              />
            </div>
            <div className="mb-2">
              <h5>Pie de Nota</h5>
              <label>Leyenda 1</label>
              <input
                type="text"
                className="form-control"
                name="footerMsg1"
                value={values.footerMsg1}
                onChange={handleValues}
                autoComplete="off"
              />
              <label>Leyenda 2</label>
              <input
                type="text"
                className="form-control"
                name="footerMsg2"
                value={values.footerMsg2}
                onChange={handleValues}
                autoComplete="off"
              />
              <label>Leyenda 3</label>
              <input
                type="text"
                className="form-control"
                name="footerMsg3"
                value={values.footerMsg3}
                onChange={handleValues}
                autoComplete="off"
              />
            </div>
          </fieldset>
        </div>
        <div className="card-footer p-1 text-end">
          <button type="submit" className="btn btn-primary">
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

export default TicketCliente;
