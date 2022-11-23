import { useState } from "react";
import { appContext } from "../../../../context/MainContext";
import { verifyExiste } from "../../../../assets/helpers";
import FormCompuestos from "./FormCompuestos";
import Productos from "./Productos";
import TableCompuestos from "./TableCompuestos";

const initCompuesto = {
  name: "",
  cantidad: 0,
  medida: "",
  price: 0,
  rendimiento: 0,
  insumoId: "",
  insumoCantidad: 0,
  insumoPrice: 0,
  subcategoriaId: "",
};
function CompuestosContainer() {
  const {
    almacenes,
    compuestos,
    createCompuesto,
    updateCompuesto,
    deleteCompuesto,
    categorias,
    subcategorias,
    productos,
    updateProducto,
    session,
  } = appContext();

  const [compuesto, setCompuesto] = useState(initCompuesto);
  const [selectedCompuestos, setSelectedCompuestos] = useState([]);
  const [producto, setProducto] = useState({});

  const targetSelectCompuesto = (body) => {
    if (!producto._id) {
      alert("Selecciona un producto para continuar");
      return;
    }
    if (verifyExiste(selectedCompuestos, body.name)) {
      alert("El compuesto seleccionado ya se encuntra en la lista");
      return;
    }
    const newCompuestos = [...selectedCompuestos, body];
    setSelectedCompuestos(newCompuestos);
  };

  const deleteSelectedCompuesto = (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    const changedCompuestos = selectedCompuestos.filter(
      (compuesto) => compuesto._id !== id
    );
    setSelectedCompuestos(changedCompuestos);
  };

  const targetActualizarProducto = () => {
    if (!producto._id) {
      alert("Selecciona un producto para continuar");
      return;
    }
    const newProducto = {
      ...producto,
      compuestos: selectedCompuestos,
    };
    updateProducto(producto._id, newProducto);
    setProducto({});
    limpiar();
    return true;
  };

  const limpiar = () => {
    setSelectedCompuestos([]);
    setProducto({});
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 p-1">
          <FormCompuestos
            compuesto={compuesto}
            setCompuesto={setCompuesto}
            compuestos={compuestos}
            almacenes={almacenes}
            categorias={categorias}
            createCompuesto={createCompuesto}
            updateCompuesto={updateCompuesto}
            session={session}
          />
        </div>
        <div className="col-md-6 p-1">
          <TableCompuestos
            compuestos={compuestos}
            categorias={categorias}
            deleteCompuesto={deleteCompuesto}
            setCompuesto={setCompuesto}
            targetSelectCompuesto={targetSelectCompuesto}
          />
        </div>
        <div className="col-md-3 p-1">
          <Productos
            productos={productos}
            setProducto={setProducto}
            subcategorias={subcategorias}
            selectedCompuestos={selectedCompuestos}
            setSelectedCompuestos={setSelectedCompuestos}
            deleteSelectedCompuesto={deleteSelectedCompuesto}
            targetActualizarProducto={targetActualizarProducto}
            limpiar={limpiar}
          />
        </div>
      </div>
    </div>
  );
}

export default CompuestosContainer;
