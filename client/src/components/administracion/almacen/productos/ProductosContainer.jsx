import { useState } from "react";
import FormProductos from "./FormProductos";
import TableProductos from "./TableProductos";

const initialProducto = {
  name: "",
  price: 0,
  subcategoriaId: "",
  areaNota: "",
  contable: true,
  lastEdit: "",
  compuestos: [],
};
function ProductosContainer() {
  const [producto, setProducto] = useState(initialProducto);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4 p-1">
          <FormProductos
            producto={producto}
            setProducto={setProducto}
            initialProducto={initialProducto}
          />
        </div>
        <div className="col-md-8 p-1">
          <TableProductos setProducto={setProducto} />
        </div>
      </div>
    </div>
  );
}

export default ProductosContainer;
