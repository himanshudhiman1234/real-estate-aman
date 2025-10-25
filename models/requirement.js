const mongoose = require("mongoose");

const RequirementSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Requirement = mongoose.model("Requirement", RequirementSchema);

module.exports = Requirement;
