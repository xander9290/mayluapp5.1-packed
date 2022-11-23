import { useState } from "react";
import { appContext } from "../../../../context/MainContext";
import FormAlmacenes from "./FormAlmacenes";
import FormEntradas from "./FormEntradas";
import FormInsumos from "./FormInsumos";
import TableEntradas from "./TableEntradas";
import TableInsumos from "./TableInsumos";
import TableSalidas from "./TableSalidas";
import useInsumo from "./useInsumo";

const initInsumo = {
  name: "",
  precio: 0,
  cantidad: 0,
  medida: "",
  stock: 0,
  createdAt: Date.now(),
  proveedor: "",
};
const initAlmacen = {
  name: "",
  insumos: [],
  entradas: [],
};
function AlmacenesContainer() {
  const {
    almacenes,
    createAlmacen,
    updateAlmacen,
    deleteAlmacen,
    session,
    getItems,
  } = appContext();

  const [almacen, setAlmacen] = useState(initAlmacen);
  const [insumo, setInsumo] = useState(initInsumo);

  const {
    insumos,
    createInsumo,
    updateInsumo,
    deleteInsumo,
    createEntrada,
    fechasEntradas,
    getEntradas,
    entradas,
    deleteEntrada,
    lastUpdate,
    actualizarStock,
    salidaInsumos,
  } = useInsumo(almacen, setAlmacen, updateAlmacen, getItems);

  const selectAlmacen = (id) => {
    setAlmacen({ name: "", insumos: [] });
    setInsumo(initInsumo);
    const getAlmacen = almacenes.find((almacen) => almacen._id === id);
    if (!getAlmacen) return;
    setAlmacen(getAlmacen);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 p-1">
          <FormAlmacenes
            almacen={almacen}
            almacenes={almacenes}
            createAlmacen={createAlmacen}
            deleteAlmacen={deleteAlmacen}
            selectAlmacen={selectAlmacen}
          />
          <FormInsumos
            insumo={insumo}
            setInsumo={setInsumo}
            almacen={almacen}
            createInsumo={createInsumo}
            updateInsumo={updateInsumo}
          />
        </div>
        <div className="col-md-6 p-1">
          <nav className="nav nav-tabs mb-1" role="tablist">
            <button
              className="nav-link active"
              data-bs-toggle="tab"
              data-bs-target="#insumos"
              type="button"
              role="tab"
              aria-controls="insumos"
              aria-selected="true"
            >
              Insumos
            </button>
            <button
              className="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#entradas"
              type="button"
              role="tab"
              aria-controls="Entradas"
              aria-selected="false"
            >
              Entradas
              <span className="badge bg-primary ms-1">{entradas.length}</span>
            </button>
            <button
              className="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#salidas"
              type="button"
              role="tab"
              aria-controls="Salidas"
              aria-selected="false"
            >
              Salidas
            </button>
          </nav>
          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="insumos"
              role="tabpanel"
            >
              <TableInsumos
                insumos={insumos}
                setInsumo={setInsumo}
                deleteInsumo={deleteInsumo}
                lastUpdate={lastUpdate}
                actualizarStock={actualizarStock}
              />
            </div>
            <div className="tab-pane fade" id="entradas" role="tabpanel">
              <TableEntradas
                entradas={entradas}
                deleteEntrada={deleteEntrada}
              />
            </div>
            <div className="tab-pane fade" id="salidas" role="tablist">
              <TableSalidas salidaInsumos={salidaInsumos} />
            </div>
          </div>
        </div>
        <div className="col-md-3 p-1">
          <FormEntradas
            almacen={almacen}
            insumos={insumos}
            createEntrada={createEntrada}
            operador={session.operador}
            fechas={fechasEntradas}
            getEntradas={getEntradas}
          />
        </div>
      </div>
    </div>
  );
}

export default AlmacenesContainer;
