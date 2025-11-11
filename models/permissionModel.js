// models/permissionModel.js
const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  module:     { type: String, required: true },                      // e.g. "BOOKING MANAGEMENT"
  action:     { type: String, required: true, unique: true },        // e.g. "view_booking", "update_booking"
  description:{ type: String },                                      // friendly description
  riskLevel:  { type: String, enum: ["Low","Medium","Critical"], default: "Low" },
}, { timestamps: true });

module.exports = mongoose.model("Permission", permissionSchema);
