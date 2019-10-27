const mongoose = require("mongoose");

// Definición del schema
const detallePresupuestoSchema = new mongoose.Schema({
    presupuesto: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      required: true,
    },
    valorPrevisto: {
      type: Number,
      required: true,
    },
    valorReal: {
        type: Number,
        default:0
      },
    fecha: {type: Date, default:Date.now}
  });

  module.exports = mongoose.model('DetallePresupuesto', detallePresupuestoSchema);