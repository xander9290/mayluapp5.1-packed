import { useState } from "react";
import FormCategorias from "./FormCategorias";
import FormModificadores from "./FormModificadores";
import FormSubcategorias from "./FormSubcategorias";

function CategoriasContainer() {
  const [modificadores, setModificadores] = useState([]);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState("none");

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 p-1">
          <FormCategorias />
        </div>
        <div className="col-md-4 p-1">
          <FormSubcategorias
            modificadores={modificadores}
            setModificadores={setModificadores}
            setSelectedSubcategoria={setSelectedSubcategoria}
          />
        </div>
        <div className="col-md-5 p-1">
          <FormModificadores
            modificadores={modificadores}
            setModificadores={setModificadores}
            selectedSubcategoria={selectedSubcategoria}
          />
        </div>
      </div>
    </div>
  );
}

export default CategoriasContainer;
