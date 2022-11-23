import Cuenta from "../models/Cuenta.model.js";
const cuentaController = {};

// get cuentas fecha Abiertas
cuentaController.getCuentasAbiertas = async (req, res) => {
  //  $or: [{ estado: "abierto" }, { estado: "pendiente" }],
  //       $not: { estado: "cerrado" },
  try {
    const cuentas = await Cuenta.find({
      $or: [{ estado: "abierto" }, { estado: "pendiente" }],
    })
      .lean()
      .sort({ folio: "asc" });
    res.json(cuentas);
  } catch (error) {
    console.log(error);
  }
};

// get cuentas por dos fechas
cuentaController.getCuentaPorFecha = async (req, res) => {
  try {
    const { gte, lte } = req.params;
    const cuentas = await Cuenta.find({
      fecha: { $gte: gte, $lte: lte },
    }).lean();
    res.json({ total: cuentas.length, cuentas });
  } catch (error) {
    console.log(error);
  }
};

// get cuentas por historial
cuentaController.getCuentaHistorial = async (req, res) => {
  try {
    const { fecha } = req.params;
    const cuentas = await Cuenta.find({ fecha }).lean().sort({ orden: "asc" });
    res.json(cuentas);
  } catch (error) {
    console.log(error);
  }
};

// get cuetnas por cliente historial
cuentaController.getCuentaClienteHistorial = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const cuentas = await Cuenta.find({ clienteId })
      .lean()
      .sort({ createdAt: "asc" });
    res.json(cuentas);
  } catch (error) {
    console.log(error);
  }
};

// create Cuenta
cuentaController.createCuenta = async (req, res) => {
  try {
    const lastFolio = await Cuenta.find()
      .lean()
      .sort({ _id: -1 })
      .limit(1)
      .lean();
    const currentDate = fechaActual(Date.now());
    let folio = 0;
    let orden = 0;
    if (lastFolio.length === 0) {
      folio = 1;
      orden = 1;
    } else {
      const oldDate = lastFolio[0].fecha;
      if (oldDate === currentDate) {
        folio = lastFolio[0].folio + 1;
        orden = lastFolio[0].orden + 1;
      } else {
        orden = 1;
        folio = lastFolio[0].folio + 1;
      }
    }
    const genCuenta = {
      ...req.body,
      folio,
      orden,
    };
    const cuenta = new Cuenta(genCuenta);
    const newCuenta = await cuenta.save();
    res.json(newCuenta);
  } catch (error) {
    console.log(error);
  }
};

// get Items
cuentaController.getItems = async (req, res) => {
  try {
    const { cancelados } = req.query;
    const { gte, lte } = req.params;
    let list;
    const items = [];
    const cuentas = await Cuenta.find({
      fecha: { $gte: gte, $lte: lte },
    }).lean();
    const cuentasActivas = cuentas.filter(
      (cuenta) => cuenta.estado !== "cancelado"
    );
    cuentasActivas.forEach((cuenta) => {
      cuenta.items.forEach((item) => {
        items.push(item);
      });
    });
    if (cancelados === "true") {
      list = items;
    } else {
      list = items.filter((item) => item.cancelado === false);
    }
    res.json({ data: list });
  } catch (error) {
    console.log(error);
  }
};

// update Cuenta
cuentaController.updateCuenta = async (req, res) => {
  try {
    const { id } = req.params;
    await Cuenta.updateOne({ _id: id }, req.body);
    res.json(req.body);
  } catch (error) {
    console.log(error);
  }
};

const fechaActual = (d) => {
  const date = new Date(d);
  const ano = date.getFullYear();
  const mes = date.getMonth() + 1;
  const dia = date.getDate();

  return `${ano}-${mes < 10 ? "0" + mes : mes}-${dia < 10 ? "0" + dia : dia}`;
};

export default cuentaController;
