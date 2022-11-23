import Compuesto from "../models/Compuesto.model.js";
const compuestroController = {};

// get Compuestos
compuestroController.getCompuestos = async (req, res) => {
  const compuestos = await Compuesto.find().lean().sort({ name: "asc" });
  res.json({ data: compuestos });
};

// create Compuesto
compuestroController.createCompuesto = async (req, res) => {
  const compuesto = new Compuesto(req.body);
  const newCompuesto = await compuesto.save();
  res.json(newCompuesto);
};

// update Compuesto
compuestroController.updateCompuesto = async (req, res) => {
  const { id } = req.params;
  await Compuesto.updateOne({ _id: id }, req.body);
  res.json(req.body);
};

// delete Compuesto
compuestroController.deleteCompuesto = async (req, res) => {
  const { id } = req.params;
  await Compuesto.deleteOne({ _id: id });
  res.json({ success: true });
};

export default compuestroController;
