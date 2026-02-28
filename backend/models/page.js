const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  metaTitle: {
    type: String,
    required: false,
  },
  metaDescription: {
    type: String,
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Page", pageSchema);
