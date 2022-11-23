import { appContext } from "../../context/MainContext";
import Cuenta from "./Cuenta";
import styles from "./Main.module.css";

function CuentasActivas() {
  const { cuentas, selectCuenta } = appContext();

  const targets = (e, id) => {
    e.stopPropagation();
    selectCuenta(id);
  };
  return (
    <div
      onClick={(e) => targets(e, "")}
      className={`container-fluid ${styles.cuentasAbiertas}`}
    >
      <div className="row">
        {cuentas.map((cuenta) => {
          if (cuenta.estado !== "abierto" && cuenta.estado !== "pendiente") {
            return null;
          } else {
            return <Cuenta key={cuenta._id} cuenta={cuenta} />;
          }
        })}
      </div>
    </div>
  );
}

export default CuentasActivas;
