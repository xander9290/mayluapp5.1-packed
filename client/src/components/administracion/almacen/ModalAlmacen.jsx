import { Modal } from "react-bootstrap";
import AlmacenesContainer from "./almacenes/AlmacenesContainer";
import CategoriasContainer from "./categorias/CategoriasContainer";
import CompuestosContainer from "./compuestos/CompuestosContainer";
import ProductosContainer from "./productos/ProductosContainer";

function ModalAlmacen({ show, onHide }) {
  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-admin"
    >
      <div className="container-fluid main user-select-none">
        <div className="row">
          <div className="col-md-12 p-1 d-flex bg-success justify-content-between">
            <h3>Almacén</h3>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <nav className="col-md-12 p-1">
            <div className="nav nav-pills mb-1" role="tablist">
              <button
                className="nav-link active"
                data-bs-toggle="tab"
                data-bs-target="#almacenes"
                type="button"
                role="tab"
                aria-controls="almacenes"
                aria-selected="true"
              >
                Almacenes
              </button>
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#compuestos"
                type="button"
                role="tab"
                aria-controls="compuestos"
                aria-selected="false"
              >
                Compuestos
              </button>
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#categorias"
                type="button"
                role="tab"
                aria-controls="compuestos"
                aria-selected="false"
              >
                Categorías
              </button>
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#productos"
                type="button"
                role="tab"
                aria-controls="compuestos"
                aria-selected="false"
              >
                Productos
              </button>
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#estadistica"
                type="button"
                role="tab"
                aria-controls="compuestos"
                aria-selected="false"
              >
                Estadística
              </button>
            </div>
          </nav>
        </div>
        <div className="row">
          <div className="tab-content col-md-12 p-0">
            <div
              className="tab-pane fade show active"
              id="almacenes"
              role="tabpanel"
              aria-labelledby=""
            >
              <AlmacenesContainer />
            </div>
            <div
              className="tab-pane fade"
              id="compuestos"
              role="tabpanel"
              aria-labelledby=""
            >
              <CompuestosContainer />
            </div>
            <div
              className="tab-pane fade"
              id="categorias"
              role="tabpanel"
              aria-labelledby=""
            >
              <CategoriasContainer />
            </div>
            <div
              className="tab-pane fade"
              id="productos"
              role="tabpanel"
              aria-labelledby=""
            >
              <ProductosContainer />
            </div>
            <div
              className="tab-pane fade"
              id="estadistica"
              role="tabpanel"
              aria-labelledby=""
            >
              <h1>Estadística</h1>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
export default ModalAlmacen;
