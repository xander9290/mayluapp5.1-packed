import Subcategoria from "../models/Subcategoria.model.js";
const subcategoriaController = {};

// Get categorias
subcategoriaController.getsubCategorias = async (req, res) => {
  try {
    const subcategorias = await Subcategoria.find()
      .lean()
      .sort({ categoriaId: "asc" });
    res.json(subcategorias);
  } catch (error) {
    console.log(error);
  }
};

// create Categoría
subcategoriaController.createsubCategoria = async (req, res) => {
  try {
    const subcategoria = new Subcategoria(req.body);
    const newSubcategoria = await subcategoria.save();
    res.json(newSubcategoria);
  } catch (error) {
    console.log(error);
  }
};

// update Categoría
subcategoriaController.updatesubCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    await Subcategoria.updateOne({ _id: id }, req.body);
    res.json(req.body);
  } catch (error) {
    console.log(error);
  }
};

// delete Categorí
subcategoriaController.deletesubCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    await Subcategoria.deleteOne({ _id: id });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

export default subcategoriaController;
