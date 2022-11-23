import AdminItem from "./AdminItem";
import Clock from "./Clock";
import PuntoVentaItem from "./PuntoVentaItem";

function Nav() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success py-1">
      <div className="container-fluid">
        <span className="navbar-brand border border-2 rounded px-1 bg-dark user-select-none">
          MAYLU App
        </span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
          aria-controls="navbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbar">
          <ul className="navbar-nav me-auto">
            <PuntoVentaItem />
            <AdminItem />
          </ul>
          <Clock />
        </div>
      </div>
    </nav>
  );
}

export default Nav;
