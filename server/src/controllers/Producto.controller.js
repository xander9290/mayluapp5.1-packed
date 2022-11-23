import Producto from "../models/Producto.model.js";
const productoController = {};

// get Productos
productoController.getProductos = async (req, res) => {
  try {
    const productos = await Producto.find()
      .lean()
      .sort({ subcategoriaId: "asc" });
    res.json(productos);
  } catch (error) {
    console.log(error);
  }
};

// create Producto
productoController.createProducto = async (req, res) => {
  try {
    const genProducto = {
      ...req.body,
      codigo: await setCodigo(),
    };
    const producto = new Producto(genProducto);
    const newProducto = await producto.save();
    res.json(newProducto);
  } catch (error) {
    console.log(error);
  }
};

// update Producto
productoController.updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await Producto.updateOne({ _id: id }, req.body);
    res.json(req.body);
  } catch (error) {
    console.log(error);
  }
};

// delete Producto
productoController.deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await Producto.deleteOne({ _id: id });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

const setCodigo = async () => {
  let existe = false;
  let newCodigo;
  const productos = await Producto.find().lean();

  do {
    newCodigo = Math.floor(10000 + Math.random() * 90000);
    for (let i = 0; i < productos.length; i++) {
      if (productos[i].codigo === newCodigo) {
        existe = true;
        break;
      }
    }
  } while (existe);
  return newCodigo;
};

export default productoController;
