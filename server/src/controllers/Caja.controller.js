import Caja from "../models/Caja.model.js";
// const spawn = require("child_process").spawn;
import { spawn } from "child_process";
const cajaController = {};

// get Caja
cajaController.getCajas = async (req, res) => {
  try {
    const cajas = await Caja.find().lean().sort({ _id: "desc" });
    res.json(cajas);
  } catch (error) {
    console.log(error);
  }
};

// create Caja
cajaController.createCaja = async (req, res) => {
  try {
    const cajas = await Caja.find().lean();
    const genCaja = {
      ...req.body,
      folio: cajas.length + 1,
    };
    const caja = await new Caja(genCaja);
    const newCaja = await caja.save();
    res.json(newCaja);
  } catch (error) {
    console.log(error);
  }
};

// delete Caja
cajaController.deleteCaja = async (req, res) => {
  try {
    const { id } = req.params;
    await Caja.deleteOne({ _id: id });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

cajaController.startCajonPlugin = async (req, res) => {
  const ls = spawn("cmd.exe", ["/c", "cajonplugin.bat"]);
  ls.stdout.on("data", (data) => {
    console.log("stdout: " + data);
  });
  ls.stderr.on("data", (data) => {
    console.log("stderr: " + data);
  });
  res.json({ status: "done" });
};

export default cajaController;
