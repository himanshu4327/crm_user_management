const express = require("express");
const router = express.Router();
const centerController = require("../controllers/centerController");

router.post("/create", centerController.createCenter);
router.get("/list", centerController.getCenters);
router.get("/:id", centerController.getCenterById);
router.put("/:id", centerController.updateCenter);
router.delete("/:id", centerController.deleteCenter);

module.exports = router;
