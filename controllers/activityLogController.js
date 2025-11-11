const ActivityLog = require("../models/activityLogModel");

exports.getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, user, module, status, search } = req.query;
    const query = {};

    if (user) query.userId = user;
    if (module) query.module = module;
    if (status) query.status = status;
    if (search)
      query.$or = [
        { action: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];

    const logs = await ActivityLog.find(query)
      .populate("userId", "username email")
      .populate("centerId", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await ActivityLog.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      logs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
