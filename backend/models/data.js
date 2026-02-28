const mongoose = require("mongoose");

const pageDataSchema = new mongoose.Schema({
  metaTitle: {
    type: String,
    required: false,
  },
  metaDescription: {
    type: String,
    required: false,
  },
  slides: [{
    label: String,
    title: String,
    content: String,
    image: String,
  }],
  about: {
    header: String,
    content: String,
    experienceYears: { type: Number, default: 14 },
  },
  team: [{
    name: String,
    role: String,
    desc: String,
    tags: [String],
    image: String,
  }],
  services: [String],
  additionalServices: [{
    title: String,
    desc: String,
    icon: String,
  }],
  stripe: String,
  contact: {
    address: String,
    phone: String,
    email: String,
    workingHours: String,
    googleMapsEmbed: String,
  },
});

module.exports = mongoose.model("PageData", pageDataSchema);
