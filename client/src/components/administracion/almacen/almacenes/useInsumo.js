import { useState, useEffect } from "react";
import { v4 } from "uuid";
import { verifyExiste, genCodigo } from "../../../../assets/helpers";
import routes from "../../../../assets/routes";

let url;
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:3100/entradas";
} else {
  url = "/entradas";
}

function useInsumo(almacen, setAlmacen, updateAlmacen, getItems) {
  const [insumos, setInsumos] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [fechasEntradas, setFechasEntradas] = useState([]);
  const [lastUpdate, setLastUpdate] = useState("");

  useEffect(() => {
    if (!almacen._id) return;
    setInsumos(almacen.insumos);
    setLastUpdate(almacen.lastUpdate);
    getFechasEntradas();
  }, [almacen]);

  const createInsumo = (body) => {
    let res = true;
    if (verifyExiste(insumos, body.name)) {
      res = false;
      return;
    }
    const newInsumo = {
      ...body,
      name: body.name.trim().toLowerCase(),
      codigo: genCodigo(insumos).toString(),
      stock: parseInt(body.stock),
      cantidad: parseInt(body.cantidad),
      precio: parseInt(body.precio).toFixed(2),
      _id: v4(),
    };
    const changedInsumos = [...insumos, newInsumo];
    //setInsumos(changedInsumos);
    const changedAlmacen = { ...almacen, insumos: changedInsumos };
    updateAlmacen(almacen._id, changedAlmacen);
    setAlmacen(changedAlmacen);
    return res;
  };

  const updateInsumo = (id, body) => {
    let res = true;
    const changedInsumos = insumos.map((insumo) => {
      if (insumo._id === id) {
        insumo = body;
      }
      return insumo;
    });

    // setInsumos(changedInsumos);
    const changedAlmacen = { ...almacen, insumos: changedInsumos };
    updateAlmacen(almacen._id, changedAlmacen);
    setAlmacen(changedAlmacen);

    return res;
  };

  const deleteInsumo = (id) => {
    const changedInsumos = insumos.filter((inumos) => inumos._id !== id);
    const changedAlmacen = { ...almacen, insumos: changedInsumos };
    updateAlmacen(almacen._id, changedAlmacen);
    setAlmacen(changedAlmacen);
  };

  const createEntrada = async (id, body) => {
    let res = true;
    let changedInsumos = insumos;
    const newBody = {
      ...body,
      almacenId: almacen._id,
    };
    const data = await routes.post(url, newBody);
    if (data.success) {
      if (data.data.inStock) {
        console.log("updating insumo");
        changedInsumos = insumos.map((insumo) => {
          if (insumo._id === id) {
            insumo.stock = insumo.stock + parseInt(body.cantidad);
            insumo.precio =
              parseInt(body.precioUnit) !== insumo.precio
                ? parseInt(body.precioUnit)
                : insumo.precio;
            insumo.proveedor = body.proveedor;
          }
          return insumo;
        });
      }
    }

    setInsumos(changedInsumos);
    const changedAlmacen = {
      ...almacen,
      insumos: changedInsumos,
    };
    updateAlmacen(almacen._id, changedAlmacen);
    setAlmacen(changedAlmacen);

    if (entradas.length > 0) {
      const newEntradas = [...entradas, data.data];
      setEntradas(newEntradas);
    }

    return res;
  };

  const getFechasEntradas = async () => {
    const data = await routes.get(`${url}/almacen/${almacen._id}`);
    setFechasEntradas(data.data.reverse());
  };

  const getEntradas = async (fecha) => {
    const data = await routes.get(`${url}/byFecha/${fecha}`);
    setEntradas(data.data);
  };

  const deleteEntrada = async (body) => {
    let changedInsumos = insumos;
    const data = await routes.delete(`${url}/${body._id}`);

    if (data.success) {
      if (body.inStock) {
        changedInsumos = insumos.map((insumo) => {
          if (insumo.codigo === body.codigo) {
            insumo.stock = insumo.stock - parseInt(body.cantidad);
          }
          return insumo;
        });
      }
      const changedEntradas = entradas.filter(
        (entrada) => entrada._id !== body._id
      );
      setEntradas(changedEntradas);
    }

    const changedAlmacen = {
      ...almacen,
      insumos: changedInsumos,
    };

    updateAlmacen(almacen._id, changedAlmacen);
    setAlmacen(changedAlmacen);
  };

  const actualizarStock = async (fecha) => {
    if (!almacen._id) {
      alert("Selcciona un almacen para continuar");
      return;
    }
    if (fecha === lastUpdate) {
      alert("Fecha Inválida");
      return;
    }

    const items = await getItems(fecha, fecha, false);

    const listCompuestos = [];
    items.map((item) => {
      item.compuestos.map((compuesto) => {
        listCompuestos.push(compuesto);
      });
    });

    const changedInsumos = insumos.map((insumo) => {
      listCompuestos.map((compuesto) => {
        if (insumo._id === compuesto.insumoId) {
          insumo.stock = insumo.stock - compuesto.cantidad;
        }
        return compuesto;
      });
      return insumo;
    });

    setInsumos(changedInsumos);

    if (!window.confirm("¿Guardar Cambios?")) return;
    const changedAlmacen = {
      ...almacen,
      insumos: changedInsumos,
      lastUpdate: fecha,
    };
    updateAlmacen(almacen._id, changedAlmacen);
    setAlmacen(changedAlmacen);
  };

  const salidaInsumos = async (gte, lte) => {
    if (!almacen._id) {
      alert("Selcciona un almacen para continuar");
      return;
    }

    let salidas = [];
    const items = await getItems(gte, lte, false);
    const listCompuestos = [];
    items.map((item) => {
      item.compuestos.map((compuesto) => {
        listCompuestos.push(compuesto);
      });
    });

    insumos.forEach((insumo) => {
      listCompuestos.forEach((compuesto) => {
        if (insumo._id === compuesto.insumoId) {
          const newSalida = {
            desc: insumo.name,
            cantidad: compuesto.cantidad,
            costo: parseFloat(compuesto.price),
            _id: insumo._id,
            medida: insumo.medida,
          };
          salidas.push(newSalida);
        }
      });
    });

    const helper = {};
    const result = salidas.reduce(function (r, o) {
      let key = o._id + "-" + o.desc;

      if (!helper[key]) {
        helper[key] = Object.assign({}, o); // create a copy of o
        r.push(helper[key]);
      } else {
        helper[key].cantidad += o.cantidad;
        helper[key].costo += o.costo;
      }

      return r;
    }, []);

    return result;
  };

  return {
    insumos,
    createInsumo,
    updateInsumo,
    deleteInsumo,
    createEntrada,
    getEntradas,
    fechasEntradas,
    entradas,
    deleteEntrada,
    lastUpdate,
    actualizarStock,
    salidaInsumos,
  };
}

export default useInsumo;
