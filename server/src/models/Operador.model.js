import mongoose from "mongoose";
const { Schema, model } = mongoose;

const operadorSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    pswd: { type: String, required: true, trim: true },
    rol: { type: String, required: true, default: "cajero" },
    createdBy: { type: String, required: true },
    lastEdit: Date,
  },
  { timestamps: { updatedAt: false } }
);

export default model("Operadores", operadorSchema);
