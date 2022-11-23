import mongoose from "mongoose";
const { Schema, model } = mongoose;

const subcategoriaSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    categoriaId: {
      type: String,
      required: true,
    },
    modificadores: {
      type: Array,
      required: true,
      default: [],
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

export default model("Subcategorias", subcategoriaSchema);
