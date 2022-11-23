import Actividad from "../models/Actividad.model.js";
const actividadCrontroller = {};

// get activad por criterio
actividadCrontroller.getActividad = async (req, res) => {
  try {
    const { operador, fecha } = req.params;
    const actividades = await Actividad.find({ operador, fecha })
      .lean()
      .sort({ _id: "asc" });
    res.json(actividades);
  } catch (error) {
    console.log(error);
  }
};

// create Actividd
actividadCrontroller.createActividad = async (req, res) => {
  try {
    const activad = new Actividad(req.body);
    const newActividad = await activad.save();
    res.json(true);
  } catch (error) {
    console.log(error);
  }
};

export default actividadCrontroller;
