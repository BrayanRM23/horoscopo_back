const mongoose = require('mongoose');

const signoSchema = new mongoose.Schema({
    signo: { type: String, required: true },
    genero: { type: String, required: true },
    texto: { type: String, required: true },
});

const Signo = mongoose.model('Signo', signoSchema);

module.exports = Signo;
