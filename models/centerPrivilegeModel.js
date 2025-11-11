// models/centerPrivilegeModel.js
const mongoose = require("mongoose");

const centerPrivilegeSchema = new mongoose.Schema({
  centerId: { type: mongoose.Schema.Types.ObjectId, ref: "Center", required: true },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  permissions: [
    {
      permissionId: { type: mongoose.Schema.Types.ObjectId, ref: "Permission" },
      access: { type: Boolean, default: false },
    },
  ],
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("CenterPrivilege", centerPrivilegeSchema);
