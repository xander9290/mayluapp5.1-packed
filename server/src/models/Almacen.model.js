import mongoose from "mongoose";
const { Schema, model } = mongoose;

const almacenSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    insumos: { type: Array, required: true, default: [] },
    lastUpdate: { type: String, default: "" },
  },
  {
    timestamps: {
      updatedAt: false,
    },
  }
);

export default model("Almacenes", almacenSchema);
