const ActivityLog = require("../models/activityLogModel");

exports.logActivity = async ({
  userId,
  centerId,
  action,
  module,
  description,
  ipAddress,
  status = "Success",
  oldData = null,
  newData = null,
}) => {
  try {
    await ActivityLog.create({
      userId,
      centerId,
      action,
      module,
      description,
      ipAddress,
      status,
      oldData,
      newData,
    });
  } catch (err) {
    console.error("❌ Failed to log activity:", err.message);
  }
};
