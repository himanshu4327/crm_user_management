const Permission = require("../models/permissionModel");

const seedPermissions = async () => {
  const permissions = [
    { module: "USER MANAGEMENT", action: "view_users", description: "View users", riskLevel: "Low" },
    { module: "USER MANAGEMENT", action: "create_user", description: "Create new users", riskLevel: "Critical" },
    { module: "USER MANAGEMENT", action: "block_user", description: "Block user accounts", riskLevel: "Critical" },
    { module: "BOOKING MANAGEMENT", action: "view_booking", description: "View bookings", riskLevel: "Low" },
    { module: "BOOKING MANAGEMENT", action: "update_booking", description: "Update bookings", riskLevel: "Medium" },
    { module: "ACTIVITY LOGS", action: "view_logs", description: "View activity logs", riskLevel: "Medium" },
  ];

  for (const perm of permissions) {
    const exists = await Permission.findOne({ action: perm.action });
    if (!exists) {
      await Permission.create(perm);
      console.log(`✅ Permission created: ${perm.action}`);
    }
  }
};

module.exports = seedPermissions;
