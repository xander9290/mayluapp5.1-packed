import mongoose from "mongoose";
const { Schema, model, ObjectId } = mongoose;

const entradasSchema = new Schema(
  {
    name: { type: String, trim: true, unique: false },
    importe: { type: Number, required: true, default: 0 },
    precioUnit: { type: Number, required: true, default: 0 },
    cantidad: { type: Number, required: true, default: 0 },
    proveedor: { type: String, required: false, default: "" },
    createdBy: { type: String },
    codigo: { type: String, required: true },
    inStock: { type: Boolean, required: true, default: true },
    caducidad: { type: String, required: true },
    almacenId: { type: String, required: true },
    insumoId: { type: String, required: true },
    fecha: { type: String, required: true },
  },
  {
    timestamps: {
      updatedAt: false,
    },
  }
);

export default model("Entradas", entradasSchema);
