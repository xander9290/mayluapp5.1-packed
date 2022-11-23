import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    subcategoriaId: { type: String, required: true },
    areaNota: { type: String, required: true },
    compuestos: { type: Array, default: [] },
    codigo: { type: Number, required: true },
    contable: { type: Boolean, required: true, default: true },
    createdBy: { type: String, required: true },
    lastEdit: Date,
  },
  { timestamps: { updatedAt: false } }
);

export default model("Productos", productoSchema);
