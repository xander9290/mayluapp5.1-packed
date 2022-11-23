import mongoose from "mongoose";
const { Schema, model } = mongoose;

const compuestoSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    cantidad: { type: Number, required: true, trim: true },
    medida: { type: String, required: true, trim: true },
    price: { type: Number, required: true, default: 0 },
    rendimiento: { type: Number, required: true, default: 0 },
    insumoId: { type: String, required: true },
    insumoCantidad: { type: Number, required: true, default: 0 },
    insumoPrice: { type: Number, required: true, default: 0 },
    categoriaId: { type: String, required: true },
  },
  {
    timestamps: { updatedAt: false },
  }
);

export default model("Compuestos", compuestoSchema);
