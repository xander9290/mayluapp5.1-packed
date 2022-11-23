import { useState } from "react";
import { appContext } from "../../../context/MainContext";
import ModalConfirm from "../../ModalConfirm";

const BtnReabrir = ({ targetReabrir }) => {
  const { cuenta } = appContext();
  const { _id, impreso } = cuenta;
  const disabled = _id && impreso;

  const [modalConfirm, setModalConfirm] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalConfirm(true)}
        disabled={!disabled}
        type="button"
        className="btn btn-success text-uppercase btn-lg fw-bold text-dark py-3 fs-4 mt-1"
      >
        <i className="bi bi-arrow-repeat me-1"></i>Reabrir
      </button>
      <ModalConfirm
        action={targetReabrir}
        show={modalConfirm}
        onHide={() => setModalConfirm(false)}
      />
    </>
  );
};

export default BtnReabrir;
