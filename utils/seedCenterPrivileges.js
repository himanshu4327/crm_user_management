const CenterPrivilege = require("../models/centerPrivilegeModel");
const Center = require("../models/centerModel");
const Role = require("../models/roleModel");
const Permission = require("../models/permissionModel");

const seedCenterPrivileges = async () => {
  const centers = await Center.find();
  const roles = await Role.find();
  const permissions = await Permission.find();

  if (!centers.length || !roles.length || !permissions.length) {
    console.log("⚠️ Missing data: seed centers, roles, and permissions first.");
    return;
  }

  for (const center of centers) {
    for (const role of roles) {
      const exists = await CenterPrivilege.findOne({ centerId: center._id, roleId: role._id });
      if (exists) continue;

      const mapped = permissions.map((p) => {
        let access = false;
        switch (role.name) {
          case "Super Admin":
            access = true;
            break;
          case "Manager":
            access = p.riskLevel !== "Critical";
            break;
          case "Agent":
            access = p.module === "BOOKING MANAGEMENT" && p.riskLevel === "Low";
            break;
          case "Customer Service":
            access = p.module === "USER MANAGEMENT" && p.riskLevel !== "Critical";
            break;
          case "Quality":
            access = p.module === "ACTIVITY LOGS";
            break;
        }
        return { permissionId: p._id, access };
      });

      await CenterPrivilege.create({ centerId: center._id, roleId: role._id, permissions: mapped });
      console.log(`✅ Privileges created for ${role.name} in ${center.name}`);
    }
  }
};

module.exports = seedCenterPrivileges;
