import { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { appContext } from "../context/MainContext";

function ModalAuth({ show, onHide, action }) {
  const { autorizacion } = appContext();
  const pswdRef = useRef();
  const [pswd, setPswd] = useState({ pswd: "" });
  const [msg, setMsg] = useState(false);

  const handlePswd = (e) => {
    setPswd({ ...pswd, [e.target.name]: e.target.value });
    setMsg(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await autorizacion(pswd);
    if (res.auth) {
      onHide();
      setTimeout(() => {
        action(res.master);
      }, 200);
    } else {
      setMsg(true);
    }
  };

  const handleShow = () => {
    pswdRef.current.focus();
    setPswd({ pswd: "" });
    setMsg(false);
  };
  return (
    <Modal
      onHide={onHide}
      show={show}
      onShow={handleShow}
      backdrop="static"
      keyboard={false}
      dialogClassName=""
      size="sm"
    >
      <Modal.Header className="p-2" closeButton>
        <Modal.Title>Autorización</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-2">
        <form onSubmit={handleSubmit} className="d-flex">
          <input
            className="form-control form-control-lg"
            type="password"
            ref={pswdRef}
            name="pswd"
            value={pswd.pswd}
            onChange={handlePswd}
            maxLength="4"
            placeholder="Contraseña"
            autoComplete="off"
            required
          />
          <button
            title="ENTRAR"
            type="submit"
            className="btn btn-primary btn-lg"
          >
            <i className="bi bi-box-arrow-in-right"></i>
          </button>
        </form>
        {msg && (
          <div className="bg-danger mt-1 text-white fs-4 fw-bold border border-2 border-white text-uppercase text-center rounded">
            denegada
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default ModalAuth;
