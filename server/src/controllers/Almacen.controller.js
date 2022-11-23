import AlmacenModel from "../models/Almacen.model.js";
const almacenController = {};

// get almacenes
almacenController.getAlmacenes = async (req, res) => {
  try {
    const almacenes = await AlmacenModel.find().lean().sort({ name: "asc" });
    res.json({ data: almacenes });
  } catch (error) {
    console.log(error);
  }
};

// create almacen
almacenController.createAlmacen = async (req, res) => {
  try {
    const almacen = new AlmacenModel(req.body);
    const newAlmacen = await almacen.save();
    res.json(newAlmacen);
  } catch (error) {
    console.log(error);
  }
};

// update almacen
almacenController.updateAlmacenes = async (req, res) => {
  try {
    const { id } = req.params;
    await AlmacenModel.updateOne({ _id: id }, req.body);
    res.json(req.body);
  } catch (error) {
    console.log(error);
  }
};

// delete almacen
almacenController.deleteAlmacenes = async (req, res) => {
  try {
    const { id } = req.params;
    await AlmacenModel.deleteOne({ _id: id });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

export default almacenController;
