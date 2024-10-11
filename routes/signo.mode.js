const mongoose = require('mongoose');

const signoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true }
});

const Signo = mongoose.model('Signo', signoSchema);

module.exports = Signo;
