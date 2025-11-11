const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who performed the action
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: "Center" },
    action: { type: String, required: true },                      // e.g. "Created User", "Updated Profile"
    module: { type: String, required: true },                      // e.g. "User Management", "Login"
    description: { type: String },                                 // free text description
    ipAddress: { type: String },
    status: { type: String, enum: ["Success", "Failed"], default: "Success" },
    oldData: { type: Object }, // optional, store before-change data
    newData: { type: Object }, // optional, store after-change data
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
