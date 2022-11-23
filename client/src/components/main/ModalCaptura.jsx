import { useState, useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { procesarItems } from "../../assets/helpers";
import { appContext } from "../../context/MainContext";

function ModalCaptura({ show, onHide, isOpenDetalle }) {
  const {
    cuenta,
    updateCuenta,
    categorias,
    subcategorias,
    productos,
    procesarCompuestos,
    session,
    compuestos,
    selectCuenta,
  } = appContext();

  const [obs, setObs] = useState({ obs: "" });
  const [contador, setContador] = useState(1);
  const [dscto, setDscto] = useState({ dscto: 0 });
  // RECURSOS
  const [catBg, setCatBg] = useState("");
  const [subcategoriasbox, setSubcategoriasbox] = useState([]);
  const [productosbox, setProductosbox] = useState([]);
  const [modificadoresbox, setModificadoresbox] = useState([]);
  // CAPTURA
  const [items, setItems] = useState([]);
  const [itemsIdx, setItemsIdx] = useState(0);
  const [total, setTotal] = useState(0);
  const [miscelaneo, setMiscelaneo] = useState({ name: "", price: 0 });

  //   Oberservaciones
  const handleObservaciones = (e) => {
    setObs({ ...obs, [e.target.name]: e.target.value });
  };

  const handleSubmitObservaciones = (e) => {
    e.preventDefault();
    if (items.length > 0) {
      const list = items;
      list[itemsIdx].modificadores.push({
        name: obs.obs.trim(),
        price: 0,
      });
      setItems([...list]);
      setObs({ obs: "" });
    }
  };

  // DESCUENTO
  const handleDscto = (e) => {
    setDscto({ ...dscto, [e.target.name]: e.target.value });
  };

  const handleSubmitDscto = (e) => {
    e.preventDefault();
    if (items.length > 0) {
      const list = items;
      const importe = list[itemsIdx].importe;
      list[itemsIdx].importe = importe - parseInt(dscto.dscto);
      list[itemsIdx].dscto = parseInt(dscto.dscto);
      setItems([...list]);
      setDscto({ dscto: 0 });
    }
  };

  //   Eiliminar item
  const eliminarItem = () => {
    const list = items;
    list.splice(itemsIdx, 1);
    setItems([...list]);
  };

  // CAPTURA DE PRODUCTOS
  const scrollRef = useRef();
  useEffect(() => {
    if (items.length > 0) {
      calcularTotal();
      scrollTop();
      setItemsIdx(!items ? 0 : items.length - 1);
    } else {
      setTotal(0);
    }
  }, [items]);

  const scrollTop = () => {
    try {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  };

  const calcularTotal = () => {
    let total = 0;
    items.map((item) => {
      total += item.importe;
    });
    setTotal(total);
  };

  // MISCELANEO
  const handleValuesMiscelaneo = (e) => {
    setMiscelaneo({ ...miscelaneo, [e.target.name]: e.target.value });
  };

  const priceRef = useRef();
  const handleSubmitMiscelaneo = (e) => {
    e.preventDefault();
    if (parseInt(miscelaneo.price) <= 0) {
      alert("no se ha asignado precio al miscelaneo".toUpperCase());
      priceRef.current.focus();
      return;
    }
    const cant = parseInt(contador);
    const importe = cant * parseInt(miscelaneo.price);
    const price = parseInt(miscelaneo.price);

    const newItem = {
      cant,
      name: miscelaneo.name.trim(),
      importe,
      price,
      dscto: 0,
      modificadores: [],
      compuestos: [],
      producto_id: "miscelaneo",
      area_nota: "area3",
      contable: false,
      createdAt: Date.now(),
      createdBy: session.operador,
      cancelado: false,
      impreso: false,
    };
    setItems([...items, newItem]);
    setMiscelaneo({ name: "", price: 0 });
    setContador(1);
  };

  // Aceptar Captura
  const aceptar = async () => {
    const oldItems = cuenta.items;
    items.map((items) => {
      oldItems.push(items);
    });
    const { importe, totalConDscto } = procesarItems(oldItems, cuenta.dscto);
    const newCta = {
      ...cuenta,
      items: oldItems,
      cashInfo: {
        ...cuenta.cashInfo,
        importe,
        total: totalConDscto,
      },
    };
    const res = await updateCuenta(cuenta._id, newCta);
    if (res) {
      onHide();
    }
  };

  const handleShow = () => {};
  const handleExited = () => {
    setObs({ obs: "" });
    setContador(1);
    setDscto({ dscto: 0 });
    setSubcategoriasbox([]);
    setProductosbox([]);
    setModificadoresbox([]);
    setItems([]);
    setTotal(0);
  };

  const selectItem = (idx) => {
    setItemsIdx(idx);
  };

  //   Captura de item
  const capturarProducto = (pdctoId) => {
    const pdcto = productos.find((producto) => producto._id === pdctoId);
    if (pdcto) {
      const cant = parseInt(contador);
      const importe = cant * parseInt(pdcto.price);
      const price = pdcto.price;

      const newItem = {
        cant,
        name: pdcto.name,
        importe,
        price,
        dscto: 0,
        modificadores: [],
        compuestos: procesarCompuestos(pdcto, cant),
        producto_id: pdcto._id,
        contable: pdcto.contable,
        area_nota: pdcto.areaNota,
        createdAt: Date.now(),
        createdBy: session.operador,
        cancelado: false,
        impreso: false,
      };

      setItems([...items, newItem]);
      setContador(1);
    }
  };

  const insertarModificador = (mod) => {
    const list = items;
    const currentCompuestos = list[itemsIdx].compuestos;
    try {
      if (mod.tipo === "sin") {
        const updatedCompuestos = currentCompuestos.filter(
          (compuesto) => compuesto._id !== mod.compuestoId
        );
        list[itemsIdx].compuestos = updatedCompuestos;
      } else {
        const getNewCompuesto = compuestos.find(
          (compuesto) => compuesto._id === mod.compuestoId
        );
        const updatedCompuestos = [...currentCompuestos, getNewCompuesto];
        list[itemsIdx].compuestos = updatedCompuestos;
      }
      list[itemsIdx].modificadores.push(mod);
      if (parseInt(mod.price) > 0) {
        list[itemsIdx].importe = list[itemsIdx].importe + parseInt(mod.price);
      }
    } catch (error) {
      alert("SELECCIONA UN PRODUCTO ANTES PARA CONTINUAR");
    }
    setItems([...list]);
  };

  // CARGA DE RECURSOS
  const loadSubcategorias = (catId, bg) => {
    setProductosbox([]);
    setModificadoresbox([]);
    const subcats = subcategorias.filter(
      (subcategoria) => subcategoria.categoriaId === catId
    );
    if (subcats.length > 0) {
      setSubcategoriasbox(subcats);
      setCatBg(bg);
    }
  };

  const loadProductos = (subcatId) => {
    const pdctos = productos.filter(
      (producto) => producto.subcategoriaId === subcatId
    );
    if (pdctos.length > 0) {
      setProductosbox(pdctos);
      const subcat = subcategorias.find(
        (subcategoria) => subcategoria._id === subcatId
      );
      setModificadoresbox(subcat.modificadores);
    }
  };
  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      dialogClassName="modal-captura"
      size="xl"
    >
      <div className="container-fluid bg-dark">
        <div className="row">
          <div className="col-md-12 p-1 d-flex justify-content-between bg-secondary">
            {/* cuenta info */}
            <ul className="list-group list-group-horizontal text-uppercase">
              <li className="list-group-item">
                <span className="fw-bold">orden: </span>
                {cuenta.orden}
              </li>
            </ul>
            {/* formulario de observaciones */}
            <form onSubmit={handleSubmitObservaciones} className="d-flex">
              <input
                className="form-control form-control-lg"
                type="text"
                name="obs"
                value={obs.obs}
                onChange={handleObservaciones}
                required
                autoComplete="off"
                placeholder="Observaciones"
              />
              <button className="btn btn-primary btn-lg" type="submit">
                <i className="bi bi-plus-square"></i>
              </button>
            </form>
            {/* boton eliminar items */}
            <button
              onClick={eliminarItem}
              title="ELIMINAR ITEM"
              type="button"
              className="btn btn-danger btn-lg"
            >
              <i className="bi bi-trash"></i>
            </button>
            {/* contador */}
            <div className="d-flex">
              <button
                title="MENOS"
                onClick={() =>
                  contador <= 1 ? undefined : setContador(contador - 1)
                }
                className="btn btn-warning btn-lg ms-3 fw-bolder"
                type="button"
              >
                <i className="bi bi-dash"></i>
              </button>
              <input
                style={{ width: "70px" }}
                className="form-control form-control-lg text-center fw-bolder"
                type="text"
                value={contador}
                readOnly
              />
              <button
                onClick={() => setContador(contador + 1)}
                className="btn btn-warning btn-lg fw-bolder"
                type="button"
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>
            {/* formulario de descuento a producto */}
            <form onSubmit={handleSubmitDscto} className="d-flex">
              <input
                style={{ width: "85px" }}
                className="form-control form-control-lg fw-bold text-center"
                type="number"
                name="dscto"
                value={dscto.dscto}
                onChange={handleDscto}
                required
                autoComplete="off"
              />
              <button className="btn btn-primary btn-lg" type="submit">
                -$
              </button>
            </form>
            {/* botones de acpetar y cancelar */}
            <button
              onClick={aceptar}
              type="button"
              className="btn btn-success btn-lg text-dark fw-bold"
              disabled={items.length > 0 ? false : true}
            >
              ACEPTAR
            </button>
            <button
              className="btn btn-danger btn-lg"
              type="button"
              onClick={onHide}
            >
              CANCELAR
            </button>
          </div>
        </div>
        <div className="row moda-captura-body">
          <div className="col lista-items-captura p-1">
            <div className="card bg-white">
              <div className="card-header p-1">
                <form onSubmit={handleSubmitMiscelaneo}>
                  <div className="mb-2 d-flex">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      name="name"
                      value={miscelaneo.name}
                      onChange={handleValuesMiscelaneo}
                      autoComplete="off"
                      required
                      placeholder="Miscelaneo"
                    />
                    <div className="input-group input-group-lg">
                      <span className="input-group-text">$</span>
                      <input
                        className="form-control"
                        type="text"
                        name="price"
                        ref={priceRef}
                        min="0"
                        value={miscelaneo.price}
                        onChange={handleValuesMiscelaneo}
                        autoComplete="off"
                        required
                      />
                    </div>
                    <button className="btn btn-primary mx-1" type="submit">
                      <i className="bi bi-plus-circle"></i>
                    </button>
                    <button
                      onClick={() =>
                        setMiscelaneo({ name: "", price: 0 }, setContador(1))
                      }
                      className="btn btn-warning"
                      type="reset"
                    >
                      <i className="bi bi-x-circle"></i>
                    </button>
                  </div>
                </form>
              </div>
              <div
                ref={scrollRef}
                className="card-body p-0 modal-cardbody-list-items"
              >
                <table className="table table-sm table-bordered border-dark">
                  <thead>
                    <tr className="text-uppercase text-center bg-secondary">
                      <th scope="col">cant</th>
                      <th scope="col">desc</th>
                      <th scope="col">importe</th>
                      <th scope="col">precio</th>
                      <th scope="col">dscto</th>
                    </tr>
                  </thead>
                  <tbody className="text-dark">
                    {items.map((item, i) => (
                      <tr
                        style={{ cursor: "default" }}
                        onClick={() => selectItem(i)}
                        key={i}
                        className={`fw-bold text-uppercase ${
                          itemsIdx === i ? "bg-info" : ""
                        }`}
                      >
                        <td className="text-center fs-5">{item.cant}</td>
                        <td>
                          <p className="p-0 m-0 text-nowrap fs-5">
                            {item.name}
                          </p>
                          {item.modificadores.map((mod, i) => (
                            <small key={i}>
                              <p className="p-0 m-0 text-nowrap">
                                {">>"} {mod.name}{" "}
                                {mod.price > 0 ? "$" + mod.price : ""}
                              </p>
                            </small>
                          ))}
                        </td>
                        <td className="text-end fs-5">${item.importe}</td>
                        <td className="text-end fs-5">${item.price}</td>
                        <td className="text-end fs-5">-${item.dscto}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card-footer p-1  d-flex justify-content-end align-items-center">
                <h3 className="text-uppercase text-end me-4">
                  Total: ${total > 0 ? total : "0"}
                </h3>
              </div>
            </div>
          </div>
          <div className="col d-flex flex-column p-1 categorias-captura bg-white">
            {categorias.map((categoria) => (
              <button
                key={categoria._id}
                onClick={() =>
                  loadSubcategorias(categoria._id, categoria.fondo)
                }
                style={{ backgroundColor: categoria.fondo, height: "70px" }}
                className="btn btn-lg text-uppercase border-1 border-dark fw-bold mb-2 text-dark"
              >
                {categoria.name}
              </button>
            ))}
          </div>
          <div
            style={{ overflowX: "hidden" }}
            className="col p-1 subcategorias-captura"
          >
            <div className="card bg-white">
              <div
                style={{
                  height: "96px",
                  overflowX: "scroll",
                }}
                className="card-header p-1"
              >
                <div style={{ whiteSpace: "nowrap" }}>
                  {subcategoriasbox.map((subcategoria) => (
                    <button
                      key={subcategoria._id}
                      onClick={() => loadProductos(subcategoria._id)}
                      style={{ backgroundColor: catBg }}
                      className="btn btn-lg text-uppercase border-1 border-white text-dark fw-bold me-1 myBtn"
                    >
                      {subcategoria.name}
                    </button>
                  ))}
                </div>
              </div>
              <div
                style={{
                  height: "395px",
                  overflowY: "scroll",
                }}
                className="card-body p-1"
              >
                <div>
                  {productosbox.map((producto) => (
                    <button
                      key={producto._id}
                      onClick={() => capturarProducto(producto._id)}
                      style={{ backgroundColor: catBg }}
                      className="btn text-uppercase border-1 border-dark text-dark fw-bold fs-5 me-1 mb-2 text-wrap myBtnP"
                    >
                      {producto.name}
                    </button>
                  ))}
                </div>
              </div>
              <div
                style={{
                  height: "100px",
                  overflowX: "auto",
                  overflowY: "hidden",
                }}
                className="card-footer p-1"
              >
                <div style={{ whiteSpace: "nowrap" }}>
                  {modificadoresbox.map((modificador, i) => (
                    <button
                      key={i}
                      onClick={() => insertarModificador(modificador)}
                      style={{ backgroundColor: catBg }}
                      className="btn btn-lg text-uppercase border-1 border-white text-dark fw-bold me-2 mb-2 myBtn"
                    >
                      {modificador.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalCaptura;
