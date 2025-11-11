const express = require("express");
const router = express.Router();
const { getActivityLogs } = require("../controllers/activityLogController");

router.get("/get-activity-logs", getActivityLogs);

module.exports = router;
