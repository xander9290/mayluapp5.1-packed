import { useEffect, useState, Fragment } from "react";
import { Modal } from "react-bootstrap";
import { formatearFecha, numeroALetras } from "../../../assets/helpers";
import { appContext } from "../../../context/MainContext";

function TicketNegocio({ show, onHide, cuenta }) {
  const { updateCuenta, reiniciarCuenta, settings } = appContext();

  const viewPrint = () => {
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
    }_${cuenta.servicio.toUpperCase()}_COMANDA`;
    w.document.close();
    w.focus();
    w.print();
    w.close();
    return true;
  };

  const [area1, setArea1] = useState([]);
  const [area2, setArea2] = useState([]);
  const [area3, setArea3] = useState([]);
  const [area4, setArea4] = useState([]);

  useEffect(() => {
    if (cuenta._id) {
      ordenarItems();
    }
  }, [cuenta]);

  const ordenarItems = () => {
    const items = [];
    const getItems = cuenta.items.filter((items) => items.cancelado === false);
    getItems.map((item) => {
      items.push(item);
    });

    const a1 = items.filter((item) => item.area_nota === "area1");

    const a2 = items.filter((item) => item.area_nota === "area2");

    const a3 = items.filter((item) => item.area_nota === "area3");

    const a4 = items.filter((item) => item.area_nota === "area4");

    setArea1([...a1]);
    setArea2([...a2]);
    setArea3([...a3]);
    setArea4([...a4]);
  };

  const handleShow = async () => {
    if (viewPrint()) {
      const newCta = {
        ...cuenta,
        impreso: true,
      };
      const res = await updateCuenta(cuenta._id, newCta);
      if (res) {
        reiniciarCuenta();
        onHide();
      }
    }
  };

  const RenderArea1 = () => {
    if (settings.notaNegocio.areasVisibles.area1) {
      return (
        <Fragment>
          {area1.length > 0 && (
            <tr>
              <td colSpan="3">
                <h5 style={{ textAlign: "center" }}>-----AREA 1-----</h5>
              </td>
            </tr>
          )}
          {area1.map((item, i) => {
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
                    style={{ textAlign: "center", paddingRight: "8px" }}
                    valign="top"
                  >
                    <p>${item.importe}</p>
                  </td>
                </tr>
              );
            }
          })}
        </Fragment>
      );
    }
  };
  const RenderArea2 = () => {
    if (settings.notaNegocio.areasVisibles.area2) {
      return (
        <Fragment>
          {area2.length > 0 && (
            <tr>
              <td colSpan="3">
                <h5 style={{ textAlign: "center" }}>-----AREA 2-----</h5>
              </td>
            </tr>
          )}
          {area2.map((item, i) => {
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
                    style={{ textAlign: "center", paddingRight: "8px" }}
                    valign="top"
                  >
                    <p>${item.importe}</p>
                  </td>
                </tr>
              );
            }
          })}
        </Fragment>
      );
    }
  };
  const RenderArea3 = () => {
    if (settings.notaNegocio.areasVisibles.area3) {
      return (
        <Fragment>
          {area3.length > 0 && (
            <tr>
              <td colSpan="3">
                <h5 style={{ textAlign: "center" }}>-----AREA 3-----</h5>
              </td>
            </tr>
          )}
          {area3.map((item, i) => {
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
                    style={{ textAlign: "center", paddingRight: "8px" }}
                    valign="top"
                  >
                    <p>${item.importe}</p>
                  </td>
                </tr>
              );
            }
          })}
        </Fragment>
      );
    }
  };
  const RenderArea4 = () => {
    if (settings.notaNegocio.areasVisibles.area4) {
      return (
        <Fragment>
          {area4.length > 0 && (
            <tr>
              <td colSpan="3">
                <h5 style={{ textAlign: "center" }}>-----AREA 4-----</h5>
              </td>
            </tr>
          )}
          {area4.map((item, i) => {
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
                    style={{ textAlign: "center", paddingRight: "8px" }}
                    valign="top"
                  >
                    ${item.importe}
                  </td>
                </tr>
              );
            }
          })}
        </Fragment>
      );
    }
  };

  return (
    <Modal
      onHide={onHide}
      show={show}
      onShow={handleShow}
      backdrop="static"
      keyboard="true"
    >
      <div style={{ textAlign: "center" }} id="ticket">
        <div style={{ textAlign: "center" }} id="infoCuenta">
          <p>
            <strong>
              orden: {cuenta.orden} {cuenta.servicio}
            </strong>
          </p>
          <p>cliente:{cuenta.torreta}</p>
          <p>
            <span>oper:{cuenta.createdBy} </span>
            <span>{formatearFecha(cuenta.createdAt).fechaHora}</span>
          </p>
        </div>
        <hr></hr>
        <div id="itemsInfo">
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>cant</th>
                <th>desc</th>
                <th>importe</th>
              </tr>
            </thead>
            <tbody>
              <RenderArea1 />
              <RenderArea2 />
              <RenderArea3 />
              <RenderArea4 />
            </tbody>
          </table>
        </div>
        <hr />
        <div id="totalInfo">
          <small>
            <ul>
              {settings.notaNegocio.totalInfo.subtotal && (
                <div>
                  {cuenta.cashInfo.dscto > 0 && (
                    <li>subtotal: ${cuenta.cashInfo.importe}</li>
                  )}
                </div>
              )}
              {settings.notaNegocio.totalInfo.descuento && (
                <div>
                  {cuenta.cashInfo.dscto > 0 && (
                    <li>descuento: -${cuenta.cashInfo.dscto}</li>
                  )}
                </div>
              )}
              {settings.notaNegocio.totalInfo.total && (
                <li>
                  <h2>total: ${cuenta.cashInfo.total}</h2>
                </li>
              )}
              {settings.notaNegocio.totalInfo.efectivo && (
                <div>
                  {cuenta.cashInfo.efectivo > 0 && (
                    <li>efectivo: ${cuenta.cashInfo.efectivo}</li>
                  )}
                </div>
              )}
              {settings.notaNegocio.totalInfo.tarjeta && (
                <div>
                  {cuenta.cashInfo.tarjeta > 0 && (
                    <li>
                      Pago con tarjeta +{cuenta.cardInfo.porcetanje}%: $
                      {cuenta.cardInfo.total}
                    </li>
                  )}
                </div>
              )}
              {settings.notaNegocio.totalInfo.cambio && (
                <div>
                  {cuenta.cashInfo.cambio > 0 && (
                    <li>cambio: ${cuenta.cashInfo.cambio}</li>
                  )}
                </div>
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
        </div>
      </div>
    </Modal>
  );
}

export default TicketNegocio;
