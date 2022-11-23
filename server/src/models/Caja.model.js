import mongoose from "mongoose";
const { Schema, model } = mongoose;

const cajaSchema = new Schema(
  {
    tipo: { type: String, required: true },
    concepto: { type: String, required: true },
    importe: { type: Number, required: true, default: 0 },
    createdBy: { type: String, required: true },
    fecha: { type: String, required: true },
    folio: { type: Number },
  },
  { timestamps: { updatedAt: false } }
);

export default model("Cajas", cajaSchema);
