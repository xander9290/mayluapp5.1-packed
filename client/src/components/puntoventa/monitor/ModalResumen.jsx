import { Modal } from "react-bootstrap";
import { formatearFecha } from "../../../assets/helpers";

function ModalResumen({
  show,
  onHide,
  servicios,
  cancelados,
  productosCancelados,
  descuentos,
  caja,
  tarjetas,
  otroMedio,
  operador,
  declaracionEfectivo,
  declaracionOtros,
  totalDeclaradoOTros,
  ventaTotal,
  totalDeclarado,
  totalEfectivo,
}) {
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
          table thead tr th {
            text-align: center;
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
    w.document.title = "resumen de venta".toUpperCase();
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
            <h1 id="title">RESUMEN DE VENTA</h1>
            <hr></hr>
            <p>{formatearFecha(Date.now()).fechaHora}</p>
            <p>operador: {operador}</p>
            <hr></hr>
            <h3>cuentas por servicio</h3>
            <h4>
              -comedor ({servicios.comedor.ctas.length}): $
              {servicios.comedor.total}
            </h4>
            <h4>
              -para llevar ({servicios.pll.ctas.length}): ${servicios.pll.total}
            </h4>
            <h4>
              -domicilio ({servicios.domicilio.ctas.length}): $
              {servicios.domicilio.total}
            </h4>
            <h2>venta total: ${ventaTotal}</h2>
            <hr></hr>
            {(caja.retiros.qty.length > 0 || caja.depositos.qty.length > 0) && (
              <div>
                <h3>movimientos en caja</h3>
                {caja.retiros.qty.map((gasto, i) => (
                  <div key={i * 2}>
                    <h4>
                      {gasto.tipo}-concepto: {gasto.concepto} -$
                      {gasto.importe}
                    </h4>
                    <p>-----------------------------------</p>
                  </div>
                ))}
                {caja.retiros.total > 0 && (
                  <>
                    <h4>total retiros: -${caja.retiros.total}</h4>
                    <hr></hr>
                  </>
                )}
                {caja.depositos.qty.map((deposito, i) => (
                  <div key={i * 3}>
                    <h4>
                      {deposito.tipo}: {deposito.concepto} +$
                      {deposito.importe}
                    </h4>
                    <p>----------------------------------</p>
                  </div>
                ))}
                {caja.depositos.qty.length > 0 && (
                  <>
                    <h4>total depósitos: +${caja.depositos.total}</h4>
                    <hr></hr>
                  </>
                )}
              </div>
            )}
            {tarjetas.qty.length > 0 && (
              <div>
                <h3>pagos con tarjeta</h3>
                {tarjetas.qty.map((cuenta, i) => (
                  <div key={i * 4}>
                    <h4>
                      -orden: {cuenta.orden} total: ${cuenta.cashInfo.tarjeta}
                      <p style={{ margin: "0", padding: "0" }}>
                        <small>
                          {formatearFecha(cuenta.createdAt).fechaHora}
                        </small>
                      </p>
                    </h4>
                  </div>
                ))}
                <p>-------------------------------------</p>
                <h4>total de tarjetas: ${tarjetas.total}</h4>
                <hr></hr>
              </div>
            )}
            <div
              style={{
                display: otroMedio.qty.length > 0 ? "block" : "none",
              }}
            >
              <h3>pagos con otros medios</h3>
              {otroMedio.list.map((medio, i) => (
                <div key={i * 5}>
                  <h4>
                    -{medio.name} ({medio.qty}) total: ${medio.total}
                  </h4>
                </div>
              ))}
              <p>-------------------------------------</p>
              <h4>total otros medios: ${otroMedio.total}</h4>
              <hr></hr>
            </div>
            <h2
              style={{
                display: totalDeclarado > 0 ? "none" : "block",
              }}
            >
              efectivo: ${totalEfectivo}
            </h2>
            <div style={{ display: descuentos.length > 0 ? "block" : "none" }}>
              <hr></hr>
              <h3>ordenes con descuento</h3>
              {descuentos.map((cuenta, i) => (
                <div key={i * 5}>
                  <h4>-orden:{cuenta.orden}</h4>
                  <h4>importe:${cuenta.importe}</h4>
                  <h4>dscto:-%{cuenta.dscto}</h4>
                  <h4>
                    total:$
                    {cuenta.total}
                  </h4>
                  <h4>{formatearFecha(cuenta.createdAt).fechaHora}</h4>
                  <p>-------------------------------------</p>
                </div>
              ))}
            </div>
            <div style={{ display: cancelados.length > 0 ? "block" : "none" }}>
              <hr></hr>
              <h3>ordenes canceladas</h3>
              {cancelados.map((cuenta, i) => (
                <div key={i * 6}>
                  <h4>
                    -orden: {cuenta.orden} total: ${cuenta.cashInfo.importe}
                    <p>
                      -motivo:{" "}
                      {cuenta.motivoCancelado && cuenta.motivoCancelado}
                    </p>
                    <p style={{ margin: "0", padding: "0" }}>
                      <small>
                        {formatearFecha(cuenta.createdAt).fechaHora}
                      </small>
                    </p>
                  </h4>
                  <p>-------------------------------------</p>
                </div>
              ))}
            </div>
            <div
              style={{
                display: productosCancelados.length > 0 ? "block" : "none",
              }}
            >
              <hr></hr>
              <h3>productos cancelados</h3>
              {productosCancelados.map((p, i) => (
                <div key={i * 7}>
                  <h4>
                    <p>
                      {p.cant} {p.name}
                    </p>
                    <p>-orden: {p.orden && p.orden}</p>
                    <p>-motivo: {p.motivo && p.motivo}</p>
                    <p style={{ margin: "0", padding: "0" }}>
                      <small>
                        {p.hora && formatearFecha(p.hora).fechaHora}
                      </small>
                    </p>
                  </h4>
                  <p>-------------------------------------</p>
                </div>
              ))}
            </div>
            {/* declaración de cajero */}
            <div
              style={{
                display: totalDeclarado > 0 ? "block" : "none",
              }}
            >
              <h3>DECLARACIÓN DE CAJERO</h3>
              <p
                style={{
                  display: declaracionOtros.gastos > 0 ? "block" : "none",
                }}
              >
                gastos: ${declaracionOtros.gastos}
              </p>
              <p
                style={{
                  display: declaracionOtros.tarjetas > 0 ? "block" : "none",
                }}
              >
                tarjetas: ${declaracionOtros.tarjetas}
              </p>
              <p
                style={{
                  display: declaracionOtros.otrosMedios > 0 ? "block" : "none",
                }}
              >
                otros medios: ${declaracionOtros.otrosMedios}
              </p>
              <p
                style={{
                  display: declaracionOtros.vales > 0 ? "block" : "none",
                }}
              >
                vales: ${declaracionOtros.vales}
              </p>
              <p>-------------------------------------</p>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>denominación</th>
                    <th>cantidad</th>
                    <th>importe</th>
                  </tr>
                </thead>
                <tbody style={{ textAlign: "center" }}>
                  <tr
                    style={{
                      visibility:
                        declaracionEfectivo.mil.importe > 0 ? "" : "collapse",
                      textAlign: "center",
                    }}
                  >
                    <td>$100</td>
                    <td>{declaracionEfectivo.mil.qty}</td>
                    <td>${declaracionEfectivo.mil.importe}</td>
                  </tr>
                  <tr
                    style={{
                      visibility:
                        declaracionEfectivo.quinientos.importe > 0
                          ? ""
                          : "collapse",
                    }}
                  >
                    <td>$500</td>
                    <td>{declaracionEfectivo.quinientos.qty}</td>
                    <td>${declaracionEfectivo.quinientos.importe}</td>
                  </tr>
                  <tr
                    style={{
                      visibility:
                        declaracionEfectivo.doscientos.importe > 0
                          ? ""
                          : "collapse",
                    }}
                  >
                    <td>$200</td>
                    <td>{declaracionEfectivo.doscientos.qty}</td>
                    <td>${declaracionEfectivo.doscientos.importe}</td>
                  </tr>
                  <tr
                    style={{
                      visibility:
                        declaracionEfectivo.cien.importe > 0 ? "" : "collapse",
                    }}
                  >
                    <td>$100</td>
                    <td>{declaracionEfectivo.cien.qty}</td>
                    <td>${declaracionEfectivo.cien.importe}</td>
                  </tr>
                  <tr
                    style={{
                      visibility:
                        declaracionEfectivo.cincuenta.importe > 0
                          ? ""
                          : "collapse",
                    }}
                  >
                    <td>$50</td>
                    <td>{declaracionEfectivo.cincuenta.qty}</td>
                    <td>${declaracionEfectivo.cincuenta.importe}</td>
                  </tr>
                  <tr
                    style={{
                      visibility:
                        declaracionEfectivo.veinte.importe > 0
                          ? ""
                          : "collapse",
                    }}
                  >
                    <td>$20</td>
                    <td>{declaracionEfectivo.veinte.qty}</td>
                    <td>${declaracionEfectivo.veinte.importe}</td>
                  </tr>
                  <tr
                    style={{
                      visibility:
                        declaracionEfectivo.diez.importe > 0 ? "" : "collapse",
                    }}
                  >
                    <td>$10</td>
                    <td>{declaracionEfectivo.diez.qty}</td>
                    <td>${declaracionEfectivo.diez.importe}</td>
                  </tr>
                  <tr
                    style={{
                      visibility:
                        declaracionEfectivo.cinco.importe > 0 ? "" : "collapse",
                    }}
                  >
                    <td>$5</td>
                    <td>{declaracionEfectivo.cinco.qty}</td>
                    <td>${declaracionEfectivo.cinco.importe}</td>
                  </tr>
                  <tr
                    style={{
                      visibility:
                        declaracionEfectivo.dos.importe > 0 ? "" : "collapse",
                    }}
                  >
                    <td>$2</td>
                    <td>{declaracionEfectivo.dos.qty}</td>
                    <td>${declaracionEfectivo.dos.importe}</td>
                  </tr>
                  <tr
                    style={{
                      visibility:
                        declaracionEfectivo.peso.importe > 0 ? "" : "collapse",
                    }}
                  >
                    <td>$1</td>
                    <td>{declaracionEfectivo.peso.qty}</td>
                    <td>${declaracionEfectivo.peso.importe}</td>
                  </tr>
                </tbody>
              </table>
              <p>-------------------------------------</p>
              <h4>
                <p style={{ textAlign: "right", marginRight: "25px" }}>
                  Total Efectivo: ${totalDeclarado}
                </p>
                <p>-------------------------------------</p>
                <div style={{ textAlign: "right", marginRight: "25px" }}>
                  <p>total Sistema: ${ventaTotal}</p>
                  <p>
                    Dif:{" "}
                    {totalDeclarado + totalDeclaradoOTros - ventaTotal > 0
                      ? "+"
                      : "-"}
                    $
                    {Math.abs(
                      totalDeclarado + totalDeclaradoOTros - ventaTotal
                    )}
                  </p>
                  <p>Total cajero: ${totalDeclarado + totalDeclaradoOTros}</p>
                </div>
              </h4>
              <hr></hr>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ModalResumen;
