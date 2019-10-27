const mongoose = require("mongoose");

// Definición del schema
const presupuestoSchema = new mongoose.Schema({
    nombre: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    ingresoIncial: {
      type: Number,
      required: true,
    },
    usuario: {
      type: String,
      required: true,
    },
    fecha: {type: Date, default:Date.now}
  });

  module.exports = mongoose.model('Presupuesto', presupuestoSchema);