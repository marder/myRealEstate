const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
    default: "Autor",
  },
  content: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
    default: "Ogólne",
  },
  status: {
    type: String,
    enum: ["Szkic", "Opublikowano"],
    default: "Opublikowano",
  },
  image: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: false,
    default: Date("2000-01-01"),
  },
});

module.exports = mongoose.model("BlogPost", blogPostSchema);
