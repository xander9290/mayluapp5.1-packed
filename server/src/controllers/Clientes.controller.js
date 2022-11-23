import Cliente from "../models/Cliente.model.js";
const clienteController = {};

// get Clientes
clienteController.getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().lean().sort({ name: "asc" });
    res.json(clientes);
  } catch (err) {
    console.log(err);
  }
};

// create Cliente
clienteController.createCliente = async (req, res) => {
  try {
    const genCliente = {
      ...req.body,
      codigo: await setCodigo(),
    };
    const cliente = new Cliente(genCliente);
    const newCliente = await cliente.save();
    res.json(newCliente);
  } catch (err) {
    console.log(err);
  }
};

// update Cliente
clienteController.updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    await Cliente.updateOne({ _id: id }, req.body);
    res.json(req.body);
  } catch (err) {
    console.log(err);
  }
};

// delete Cliente
clienteController.deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    await Cliente.deleteOne({ _id: id });
    res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
};

const setCodigo = async () => {
  let existe = false;
  let newCodigo;
  const clientes = await Cliente.find().lean();

  do {
    newCodigo = Math.floor(10000 + Math.random() * 90000);
    for (let i = 0; i < clientes.length; i++) {
      if (clientes[i].codigo === newCodigo) {
        existe = true;
        break;
      }
    }
  } while (existe);
  return newCodigo;
};

export default clienteController;
