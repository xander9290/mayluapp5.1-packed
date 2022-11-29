import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { formatearFecha, numeroALetras } from "../../../assets/helpers";
import { appContext } from "../../../context/MainContext";

const initialCliente = {
  name: "",
  tel: "",
  calle: "",
  cruces: "",
  colonia: "",
  obs: "",
  codigo: null,
  lastEdit: "",
};
function TicketCliente({ show, onHide, cuenta }) {
  const { clientes, settings } = appContext();

  const viewVista = () => {
    const printContents = document.getElementById("ticket").innerHTML;
    const w = window.open("", "PRINT", "height=600,width=700");
    w.document.write(`
    <style>
        * {
            text-transform: uppercase;
            font-family: Ticketing;
        }
        h1,h2,h3,h4,h5,h6,p {
            margin: 0;
            padding: 0;
        }
        #logoContainer {
          background-color: black;
          color: white;
          border-radius: 6px;
          text-align: center;
          width: 58%;
          margin: 0 auto;
          padding: 8px;
  }
        #logoNameTitle {
            font-size: 35px;
            font-family: China !important;
        }
        #logoSubName {
            font-size: 18px;
            font-family: China !important;
        }
        #logo {
            border: 3px dashed white;
            border-radius: 6px;
            padding: 6px;
        }
        #infoEmpresa {
            text-align: center;
        }
        #infoCuenta {
            text-align: center;
        }
        #repartoTel {
          display: flex;
          justify-content: space-between;
        }
        #reparto {
          margin-right: 15px;
        }
        strong {
            font-size: 20px;
            font-weight: bold;
        }
        #totalInfo {
           padding-right: 40px;
        }
        ul {
            text-align: right;
        }
        ul li {
            text-decoration: none;
            display: block;
            margin-bottom: 1px;
            margin: 0px;
            padding: 0px;
          }
        #footer {
            text-align: center;
        }
    </style>
  `);
    w.document.write(printContents);
    w.document.title = `ORDEN_${
      cuenta.orden
    }_${cuenta.servicio.toUpperCase()}_NOTACLIENTE`;
    w.document.close();
    w.focus();
    w.print();
    w.close();
    return true;
  };

  const [areas, setAreas] = useState([]);
  const [cliente, setCliente] = useState(initialCliente);

  useEffect(() => {
    if (cuenta._id) {
      ordenarItems();
      getCliente();
    }
  }, [cuenta]);

  const ordenarItems = () => {
    const items = [];
    const getItems = cuenta.items.filter((items) => items.cancelado === false);
    getItems.map((item) => {
      items.push(item);
    });

    const a1 = items
      .filter((item) => item.area_nota === "area1")
      .sort((a, b) => {
        if (a.name < b.name) return -1;
      });

    const a2 = items
      .filter((item) => item.area_nota === "area2")
      .sort((a, b) => {
        if (a.name < b.name) return -1;
      });

    const a3 = items
      .filter((item) => item.area_nota === "area3")
      .sort((a, b) => {
        if (a.name < b.name) return -1;
      });

    const a4 = items
      .filter((item) => item.area_nota === "area4")
      .sort((a, b) => {
        if (a.name < b.name) return -1;
      });
    setAreas([...a1, ...a2, ...a3, ...a4]);
  };

  const getCliente = () => {
    const findCliente = clientes.find(
      (cliente) => cliente._id === cuenta.clienteId
    );
    if (findCliente) setCliente(findCliente);
  };

  const handleShow = () => {
    if (viewVista()) onHide();
  };

  return (
    <Modal
      onHide={onHide}
      show={show}
      onShow={handleShow}
      backdrop="static"
      keyboard="true"
    >
      <div id="ticket">
        {settings.notaCliente.logoTitle !== "" && (
          <div id="logoContainer">
            <div id="logo">
              <h3 id="logoNameTitle">{settings.notaCliente.logoTitle}</h3>
              <h5 id="logoSubName">{settings.notaCliente.logoSubtitle}</h5>
            </div>
          </div>
        )}
        <div id="infoEmpresa">
          {settings.notaCliente.infoAddress1 !== "" && (
            <p>{settings.notaCliente.infoAddress1}</p>
          )}
          {settings.notaCliente.infoAddress2 !== "" && (
            <p>{settings.notaCliente.infoAddress2}</p>
          )}
          {settings.notaCliente.infoAddress3 !== "" && (
            <p>{settings.notaCliente.infoAddress3}</p>
          )}
          {settings.notaCliente.infoTel !== "" && (
            <p id="tel">tel: {settings.notaCliente.infoTel}</p>
          )}
          {settings.notaCliente.infoWapp !== "" && (
            <p id="wsap">whatsapp: {settings.notaCliente.infoWapp}</p>
          )}
        </div>
        <div id="infoCuenta">
          <p>
            <strong>
              orden: {cuenta.orden} {cuenta.servicio}
            </strong>
          </p>
          <p>
            <span>
              {cuenta.servicio === "comedor" ? "mesa: " : "cliente: "}
            </span>
            <span> {cuenta.torreta}</span>
          </p>
          <p>
            <span>oper:{cuenta.createdBy} </span>
            <span>{formatearFecha(cuenta.createdAt).fechaHora}</span>
          </p>
        </div>
        {cuenta.servicio === "comedor" ? null : !cuenta.clienteId ? null : (
          <div style={{ paddingLeft: "10px" }} id="clienteInfo">
            <hr></hr>
            <p style={{ fontSize: "18px" }}>
              {cliente.calle}, entre:
              {cliente.cruces}, col: {cliente.colonia}
            </p>
            <small id="repartoTel">
              <p style={{ fontSize: "18px" }}>tel: {cliente.tel}</p>
              {cuenta.repartidor && (
                <span id="reparto">Reparto: {cuenta.repartidor}</span>
              )}
            </small>
            <small>{cliente.obs && <p>obs: {cliente.obs}</p>}</small>
          </div>
        )}
        <hr></hr>
        <div id="itemsInfo">
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>cant</th>
                <th>desc</th>
                <th style={{ textAlign: "start" }}>importe</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((item, i) => {
                if (!item.cancelado) {
                  return (
                    <tr key={i}>
                      <td style={{ textAlign: "center" }} valign="top">
                        {item.cant}
                      </td>
                      <td>
                        <p>{item.name}</p>
                        <small>
                          {item.modificadores.map((m, i) => (
                            <p key={i}>
                              {">>"}
                              {m.name} {m.price > 0 ? "$" + m.price : ""}
                            </p>
                          ))}
                        </small>
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          paddingRight: "22px",
                        }}
                        valign="top"
                      >
                        <p>${item.importe}</p>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
          <hr></hr>
        </div>
        <div id="totalInfo">
          <small>
            <ul>
              {cuenta.cashInfo.dscto > 0 && (
                <li>subtotal: ${cuenta.cashInfo.importe}</li>
              )}
              {cuenta.cashInfo.dscto > 0 && (
                <li>descuento: -${cuenta.cashInfo.dscto}</li>
              )}
              <li>
                <h2>total: ${cuenta.cashInfo.total}</h2>
              </li>
              {cuenta.cashInfo.efectivo > 0 && (
                <li>efectivo: ${cuenta.cashInfo.efectivo}</li>
              )}
              {cuenta.cashInfo.tarjeta > 0 && (
                <li>
                  <div className="d-flex flex-column">
                    <div>Pago con tarjeta</div>
                    <div>Comisión: +${cuenta.cardInfo.porcentaje}</div>
                    <div>total tarjeta: ${cuenta.cardInfo.total}</div>
                  </div>
                </li>
              )}
              {cuenta.otroMedio.total > 0 && (
                <li>
                  {cuenta.otroMedio.medio}: ${cuenta.otroMedio.total}
                </li>
              )}
              {cuenta.cashInfo.cambio > 0 && (
                <li>cambio: ${cuenta.cashInfo.cambio}</li>
              )}
            </ul>
            <div style={{ paddingLeft: "10px" }}>
              {numeroALetras(cuenta.cashInfo.total, {
                plural: "PESOS 00/100",
                singular: "PESO 00/100",
              })}
            </div>
          </small>
          <hr></hr>
          <div id="footer">
            {settings.notaCliente.footerMsg1 !== "" && (
              <p>{settings.notaCliente.footerMsg1}</p>
            )}
            {settings.notaCliente.footerMsg2 !== "" && (
              <small>
                <p>{settings.notaCliente.footerMsg2}</p>
              </small>
            )}
            {settings.notaCliente.footerMsg3 !== "" && (
              <small>
                <p>{settings.notaCliente.footerMsg3}</p>
              </small>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default TicketCliente;
