import mongoose from "mongoose";
const { Schema, model } = mongoose;

const categoriaSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fondo: {
      type: String,
      required: true,
      default: "#FFFFFF",
    },
    createdBy: {
      type: String,
      required: true,
    },
    lastEdit: Date,
  },
  {
    timestamps: {
      updatedAt: false,
    },
  }
);

export default model("Categorias", categoriaSchema);
