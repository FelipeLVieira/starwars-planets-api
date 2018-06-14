const mongoose = require('mongoose');
const PlanetSchema = new mongoose.Schema({
    nome: String,
    clima: String,
    terreno: String,
    films: []
});
module.exports = mongoose.model('Planet', PlanetSchema);