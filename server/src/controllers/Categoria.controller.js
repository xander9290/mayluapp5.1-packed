import Categoria from "../models/Categoria.model.js";
const categoriaController = {};

// Get categorias
categoriaController.getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find().lean().sort({ name: "asc" });
    res.json(categorias);
  } catch (error) {
    console.log(error);
  }
};

// create Categoría
categoriaController.createCategoria = async (req, res) => {
  try {
    const categoria = new Categoria(req.body);
    const newCategoria = await categoria.save();
    res.json(newCategoria);
  } catch (error) {
    console.log(error);
  }
};

// update Categoría
categoriaController.updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    await Categoria.updateOne({ _id: id }, req.body);
    res.json(req.body);
  } catch (error) {
    console.log(error);
  }
};

// delete Categorí
categoriaController.deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    await Categoria.deleteOne({ _id: id });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

export default categoriaController;
