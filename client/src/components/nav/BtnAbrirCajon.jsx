import { useState } from "react";
import { appContext } from "../../context/MainContext";
import ModalAuth from "../ModalAuth";

function BtnAbrirCajon({ targetAbrirCajon }) {
  const { session } = appContext();
  const [modalAuth, setModalAuth] = useState(false);

  const targetModalAuth = async () => {
    if (session.rol === "master") {
      await targetAbrirCajon();
      return;
    }
    // if (session.rol === "cajero") {
    //   await targetAbrirCajon();
    //   return;
    // }
    setModalAuth(true);
  };

  return (
    <>
      <a onClick={targetModalAuth} href="#" className="dropdown-item fs-5 py-2">
        Abrir cajón
      </a>
      <ModalAuth
        action={targetAbrirCajon}
        show={modalAuth}
        onHide={() => setModalAuth(false)}
      />
    </>
  );
}

export default BtnAbrirCajon;
