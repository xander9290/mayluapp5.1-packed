import mongoose from "mongoose";
const { Schema, model } = mongoose;

const cuentaSchema = new Schema(
  {
    folio: { type: Number, default: 1 },
    orden: { type: Number, default: 1 },
    torreta: { type: String, default: "", trim: true },
    personas: { type: Number, default: 1 },
    servicio: { type: String, default: "" },
    clienteId: { type: String, default: null },
    estado: { type: String, default: "abierto" },
    motivoCancelado: { type: String, default: "", trim: true },
    impreso: { type: Boolean, default: false },
    items: { type: Array, default: [] },
    cashInfo: {
      type: Object,
      default: {
        importe: 0,
        dscto: 0,
        total: 0,
        efectivo: 0,
        tarjeta: 0,
        cambio: 0,
      },
    },
    cardInfo: {
      type: Object,
      default: { porcentaje: 0, importe: 0, total: 0 },
    },
    otroMedio: {
      type: Object,
      default: { medio: null, total: 0 },
    },
    createdBy: { type: String },
    repartidor: { type: String, default: "" },
    closedAt: { type: Date, default: "" },
    time: { type: String, default: "" },
    fecha: { type: String, default: "" },
    obs: { type: String, default: "" },
  },
  {
    timestamps: { updatedAt: false },
  }
);

export default model("Cuentas", cuentaSchema);
