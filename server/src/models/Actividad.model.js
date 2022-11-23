import mongoose from "mongoose";
const { Schema, model } = mongoose;

const actividadSchema = new Schema(
  {
    operador: { type: String, required: true },
    fecha: { type: String, required: true },
    commit: { type: String, required: true },
    auth: { type: String, required: true },
  },
  {
    timestamps: {
      updatedAt: false,
    },
  }
);

export default model("Actividades", actividadSchema);
