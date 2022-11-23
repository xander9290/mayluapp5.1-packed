import Entrada from "../models/Entrada.model.js";
const entradaController = {};

// create Entrada
entradaController.createEntrada = async (req, res) => {
  try {
    const entrada = new Entrada(req.body);
    const newEntrada = await entrada.save();
    res.json({ data: newEntrada, success: true });
  } catch (error) {
    console.log(error);
  }
};

// get Entradas by almacen
entradaController.getEntradasByAlmacen = async (req, res) => {
  try {
    const { id } = req.params;
    const entradas = await Entrada.find({ almacenId: id }).lean();
    const helper = {};
    const fechas = entradas.reduce(function (r, o) {
      let key = o.fecha;

      if (!helper[key]) {
        helper[key] = Object.assign({}, o);
        r.push(helper[key]);
      }

      return r;
    }, []);
    res.json({ data: fechas });
  } catch (error) {
    console.log(error);
  }
};

// get Entradas by fecha
entradaController.getEntradasByFecha = async (req, res) => {
  try {
    const { fecha } = req.params;
    const entradas = await Entrada.find({ fecha }).lean();
    res.json({ data: entradas });
  } catch (error) {
    console.log(error);
  }
};

// delete Entrada
entradaController.deleteEntrada = async (req, res) => {
  try {
    const { id } = req.params;
    await Entrada.deleteOne({ _id: id });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

export default entradaController;
