import { Modal } from "react-bootstrap";
import { formatearFecha } from "../../../assets/helpers";

function ModalDetallado({ show, onHide, fecha, productos, operador }) {
  const setImpresion = () => {
    const printContents = document.getElementById("body").innerHTML,
      w = window.open("", "PRINT", "height=600,width=700");
    w.document.write(`
            <style>
              *{
                text-transform: uppercase;
                font-family: Ticketing;
              }
              p,h1,h2,h3,h4,h5,h6 {
                  margin: 0;
                  padding: 0;
              }
              #title {
                  text-aling: center;
              }
              table {
                  width: 100%;
              }
              table tbody tr td {
                  font-size: 17px;
              }
              table tbody tr {
                  padding: 0;
              }
              td:first-child {
                  text-align: center
              }
              td:last-child p {
                width: 55%;
                text-align: right;
              }
            </style>`);
    w.document.title = "detallado de productos".toUpperCase();
    w.document.write(printContents);
    w.document.close();
    w.focus();
    w.print();
    w.close();
    onHide();
    return true;
  };

  const handleShow = () => {
    setImpresion();
  };

  const handleExited = () => {};

  let total = 0;
  return (
    <Modal
      onHide={onHide}
      show={show}
      size="md"
      onShow={handleShow}
      onExited={handleExited}
    >
      <Modal.Body>
        <div id="body">
          <div style={{ paddingLeft: "10px" }}>
            <br></br>
            <h2 id="title">DETALLADO DE PRODUCTOS</h2>
            <hr></hr>
            <p>
              {formatearFecha(Date.now()).hora} operador: {operador}
            </p>
            <p>
              de: {fecha.fecha1} a: {fecha.fecha2}
            </p>
            <hr></hr>
            <table>
              <thead>
                <tr>
                  <th>cant</th>
                  <th>desc</th>
                  <th>importe</th>
                </tr>
              </thead>
              <tbody>
                {productos.items.map((p, i) => {
                  total += p.importe;
                  return (
                    <tr key={i * 2}>
                      <td valign="top">{p.cant}</td>
                      <td>{p.name}</td>
                      <td valign="top">${p.importe}</td>
                    </tr>
                  );
                })}
                {productos.miscelaneos.length === 0 ? null : (
                  <tr>
                    <td></td>
                    <td>
                      <h4>---Miscelaneos---</h4>
                    </td>
                    <td></td>
                  </tr>
                )}
                {productos.miscelaneos.map((m, i) => {
                  total += m.importe;
                  return (
                    <tr key={i + 3}>
                      <td valign="top">{m.cant}</td>
                      <td>{m.name}</td>
                      <td valign="top">
                        <p>${m.importe}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <hr></hr>
            <h3>Total de ventas: ${total}</h3>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ModalDetallado;
