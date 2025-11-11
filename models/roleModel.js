// models/roleModel.js
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. Manager, Agent
});

module.exports = mongoose.model("Role", roleSchema);
