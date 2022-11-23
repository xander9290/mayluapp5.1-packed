import TicketCliente from "./TicketCliente";
import TicketNegocio from "./TicketNegocio";

function TicketsContainer() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 p-1">
          <TicketCliente />
        </div>
        <div className="col-md-3 p-1">
          <TicketNegocio />
        </div>
        <div className="col-md-3 p-1"></div>
        <div className="col-md-3 p-1"></div>
      </div>
    </div>
  );
}

export default TicketsContainer;
