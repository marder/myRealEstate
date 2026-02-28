const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  lp: {
    type: Number,
    required: true,
  },
  obreb: {
    type: String,
    required: true,
  },
  numerDzialki: {
    type: String,
    required: true,
  },
  powierzchnia: {
    type: Number,
    required: false,
  },
  wartosc: {
    type: Number,
    required: false,
  },
  uzytki: {
    type: String,
    required: false,
  },
  przeznaczenie: {
    type: String,
    required: false,
  },
  wkt: {
    type: String,
    required: false, // Geometria zostanie pobrana skryptem migracyjnym
  },
  teryt: {
    type: String,
    required: false, // Pełny identyfikator TERYT (np. 302703_5.0001.436/1)
  },
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);
