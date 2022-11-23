import ModalAdmin from "../../ModalAdmin";
import Actividad from "./Actividad";
import OperadorForm from "./OperadorForm";

function Operadores({ show, onHide }) {
  return (
    <ModalAdmin show={show} onHide={onHide} title="Operadores">
      <div className="col-md-6 p-1">
        <OperadorForm />
      </div>
      <div className="col-md-6 p-1">
        <Actividad />
      </div>
    </ModalAdmin>
  );
}

export default Operadores;
