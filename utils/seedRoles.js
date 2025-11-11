const Role = require("../models/roleModel");

const seedRoles = async () => {
  const roles = [
    { name: "Super Admin" },
    { name: "Manager" },
    { name: "Agent" },
    { name: "Customer Service" },
    { name: "Quality" },
    { name: "Teamlead" },
  ];

  for (const role of roles) {
    const exists = await Role.findOne({ name: role.name });
    if (!exists) {
      await Role.create(role);
      console.log(`✅ Role created: ${role.name}`);
    }
  }
};

module.exports = seedRoles;
