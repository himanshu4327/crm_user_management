const Center = require("../models/centerModel");

const seedCenters = async () => {
  const centers = [
    { name: "Demo Center", location: "Mumbai" },
    { name: "Delhi Center", location: "Delhi" },
    { name: "Pune Center", location: "Pune" },
  ];

  for (const center of centers) {
    const exists = await Center.findOne({ name: center.name });
    if (!exists) {
      await Center.create(center);
      console.log(`✅ Center created: ${center.name}`);
    }
  }
};

module.exports = seedCenters;
