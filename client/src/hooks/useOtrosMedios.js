import { useEffect, useState } from "react";
import { verifyExiste } from "../assets/helpers";

function useOtrosMedios() {
  const [otrosMedios, setOtrosMedios] = useState([]);

  useEffect(() => {
    getOTrosMedios();
  }, []);

  const getOTrosMedios = () => {
    if (localStorage.getItem("otrosMedios")) {
      const parseOtrosMedios = JSON.parse(localStorage.getItem("otrosMedios"));
      setOtrosMedios(parseOtrosMedios);
    } else {
      localStorage.setItem("otrosMedios", JSON.stringify([]));
    }
  };

  const createMedio = (body) => {
    const listMedios = JSON.parse(localStorage.getItem("otrosMedios"));
    if (verifyExiste(listMedios, body.name)) {
      return false;
    }
    let genId = otrosMedios.length + 1;
    body._id = genId.toString();
    const setNewMedio = JSON.stringify([...listMedios, body]);
    localStorage.setItem("otrosMedios", setNewMedio);
    getOTrosMedios();

    return true;
  };

  const deleteMedio = (id) => {
    const newMediosList = otrosMedios.filter((medio) => medio._id !== id);
    setOtrosMedios([...newMediosList]);
    localStorage.setItem("otrosMedios", JSON.stringify([...newMediosList]));
  };

  return { otrosMedios, createMedio, deleteMedio };
}

export default useOtrosMedios;
