import { createContext, useContext } from "react";
import useCaja from "../hooks/useCaja";
import useCategorias from "../hooks/useCategorias";
import useClientes from "../hooks/useClientes";
import useCompuestos from "../hooks/useCompuestos";
import useCuenta from "../hooks/useCuenta";
import useOperador from "../hooks/useOperador";
import useOtrosMedios from "../hooks/useOtrosMedios";
import useProductos from "../hooks/useProductos";
import useSubcategorias from "../hooks/useSubcategorias";
import useTickets from "../hooks/useTickets";
import useAlmacen from "../hooks/useAlmacen";

const AppContext = createContext();

export const appContext = () => {
  const context = useContext(AppContext);
  return context;
};

function MainContext({ children }) {
  const {
    operadores,
    createOperador,
    loginOperador,
    updateOperador,
    deleteOperador,
    session,
    setSession,
    autorizacion,
    createActividad,
    getActividad,
  } = useOperador();

  const {
    cuentas,
    cuenta,
    setCuenta,
    createCuenta,
    updateCuenta,
    selectCuenta,
    reiniciarCuenta,
    cuentaId,
    initialCuenta,
    cargarCuentas,
    cuentaOcupada,
    getCuentasByFechas,
    getCuentasByFecha,
    getItems,
  } = useCuenta();

  const { categorias, createCategoria, updateCategoria, deleteCategoria } =
    useCategorias();

  const {
    subcategorias,
    createSubcategoria,
    updateSubcategoria,
    deleteSubcategoria,
  } = useSubcategorias();

  const { productos, createProducto, updateProducto, deleteProducto } =
    useProductos();

  const { clientes, createCliente, updateCliente, deleteCliente } =
    useClientes();

  const { cajas, createCaja, deleteCaja, abrirCajon } = useCaja();

  const { almacenes, createAlmacen, updateAlmacen, deleteAlmacen } =
    useAlmacen();

  const {
    compuestos,
    createCompuesto,
    updateCompuesto,
    deleteCompuesto,
    procesarCompuestos,
  } = useCompuestos();

  const { settings, changeNotaNegocioSettings, changeNotaClienteSettings } =
    useTickets();

  const { otrosMedios, createMedio, deleteMedio } = useOtrosMedios();

  const data = {
    // Categorias
    categorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    // Subcategorias
    subcategorias,
    createSubcategoria,
    updateSubcategoria,
    deleteSubcategoria,
    // Productos
    productos,
    createProducto,
    updateProducto,
    deleteProducto,
    // Clientes
    clientes,
    createCliente,
    updateCliente,
    deleteCliente,
    // caja
    cajas,
    createCaja,
    deleteCaja,
    abrirCajon,
    // Operadores
    operadores,
    createOperador,
    loginOperador,
    updateOperador,
    deleteOperador,
    session,
    setSession,
    autorizacion,
    createActividad,
    getActividad,
    // cuentas
    cuentas,
    cuenta,
    setCuenta,
    createCuenta,
    updateCuenta,
    selectCuenta,
    reiniciarCuenta,
    cuentaId,
    initialCuenta,
    cargarCuentas,
    cuentaOcupada,
    getCuentasByFechas,
    getCuentasByFecha,
    getItems,
    // almacenes
    almacenes,
    createAlmacen,
    updateAlmacen,
    deleteAlmacen,
    // Compuestos
    compuestos,
    createCompuesto,
    updateCompuesto,
    deleteCompuesto,
    procesarCompuestos,
    // Tickets
    settings,
    changeNotaNegocioSettings,
    changeNotaClienteSettings,
    // Compuestos
    otrosMedios,
    createMedio,
    deleteMedio,
  };
  return <AppContext.Provider value={data}>{children}</AppContext.Provider>;
}

export default MainContext;
