import Operador from "../models/Operador.model.js";
import bcrypt from "bcrypt";
const operadorController = {};

// get Operadores
operadorController.getOperadores = async (req, res) => {
  try {
    const operadores = await Operador.find().lean().sort({ name: "asc" });
    res.json(operadores);
  } catch (error) {
    console.log(error);
  }
};

// create Operador
operadorController.createOperador = async (req, res) => {
  try {
    const { pswd } = req.body;
    const saltos = await bcrypt.genSalt(5);
    const newPswd = await bcrypt.hash(pswd, saltos);
    const genOperador = {
      ...req.body,
      pswd: newPswd,
    };
    const operador = new Operador(genOperador);
    const newOperador = await operador.save();
    res.json(newOperador);
  } catch (error) {
    console.log(error);
  }
};

// login Operador
operadorController.loginOperador = async (req, res) => {
  try {
    const { name, pswd } = req.body;
    let login = false;
    const findOperador = await Operador.findOne({ name });
    if (findOperador) {
      const getPswd = findOperador.pswd;
      const match = await bcrypt.compare(pswd, getPswd);
      if (match) login = true;
    }
    const operador = { name: findOperador.name, rol: findOperador.rol };
    res.json({ login, operador });
  } catch (error) {
    console.log(error);
  }
};

operadorController.autorizar = async (req, res) => {
  try {
    const { pswd } = req.body;
    let auth = false;
    let index;
    let master = null;
    const findMasters = await Operador.find({ rol: "master" });
    for (let i = 0; i < findMasters.length; i++) {
      let match = await bcrypt.compare(pswd, findMasters[i].pswd);
      if (match) {
        auth = true;
        index = i;
        break;
      }
    }
    if (auth) {
      master = findMasters[index].name;
    }
    res.json({ auth, master });
  } catch (error) {
    console.log(error);
  }
};

const execMasters = (masters) => {};

// update Operador
operadorController.updateOperador = async (req, res) => {
  try {
    const { id } = req.params;
    const { pswd } = req.body;
    const saltos = await bcrypt.genSalt(5);
    const newPswd = await bcrypt.hash(pswd, saltos);
    const changedOperador = {
      ...req.body,
      pswd: newPswd,
    };
    await Operador.updateOne({ _id: id }, changedOperador);
    res.json(changedOperador);
  } catch (error) {
    console.log(error);
  }
};

// delete Operador
operadorController.deleteOperador = async (req, res) => {
  try {
    const { id } = req.params;
    await Operador.deleteOne({ _id: id });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

// exit process
operadorController.exitProcess = async (req, res) => {
  process.kill(process.pid, "SIGTERM");
};

export default operadorController;
