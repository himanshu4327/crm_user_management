const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// CRUD routes
router.post("/create", userController.createUser);
router.post("/login", userController.login);
router.put("/update/:userId", userController.updateUserProfile);
router.get("/list", userController.getAllUsers);
router.get("/stats", userController.getUserStats);
router.get("/roles", userController.getRoles);
router.get("/centers", userController.getCenters);
router.put("/toggle-status/:userId", userController.toggleUserStatus);

module.exports = router;
