const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
// seeders
const seedRoles = require("./utils/seedRoles");
const seedCenters = require("./utils/seedCenters");
const seedPermissions = require("./utils/seedPermissions");
const seedCenterPrivileges = require("./utils/seedCenterPrivileges");
// ✅ Import Routes
const userRoutes = require("./routes/userRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());



// ✅ Register Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/activity-logs", activityLogRoutes);

// // ✅ Seed roles at startup (optional: comment out after first run)
// seedRoles();


// Seed data on startup
// (async () => {
//   try {
//     console.log("\n🚀 Running initial seeding...");
//     await seedRoles();
//     await seedCenters();
//     await seedPermissions();
//     await seedCenterPrivileges();
//     console.log("✅ All seed data initialized successfully!\n");
//   } catch (error) {
//     console.error("❌ Error during seeding:", error.message);
//   }
// })();


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    console.log("\n🚀 Running initial seeding...");
    await seedRoles();
    await seedCenters();
    await seedPermissions();
    await seedCenterPrivileges();
    console.log("✅ All seed data initialized successfully!\n");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Startup error:", error.message);
    process.exit(1);
  }
};

startServer();