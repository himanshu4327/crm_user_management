const User = require("../models/userModel");
const Role = require("../models/roleModel");
const jwt = require("jsonwebtoken");
const Center = require("../models/centerPrivilegeModel");
const bcrypt = require("bcryptjs");
const { logActivity } = require("../utils/activityLogger");


exports.login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const ip = req.ip || req.connection.remoteAddress;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ message: "Username/Email and password are required" });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    }).populate("roleId centerId", "name");

    if (!user) {
      await logActivity({
        action: "Login Attempt",
        module: "Authentication",
        description: `Login failed — user not found: ${usernameOrEmail}`,
        ipAddress: ip,
        status: "Failed",
      });
      return res.status(404).json({ message: "Invalid credentials" });
    }

    if (user.status === "Blocked") {
      await logActivity({
        userId: user._id,
        centerId: user.centerId,
        action: "Login Attempt",
        module: "Authentication",
        description: `Blocked user attempted login: ${user.username}`,
        ipAddress: ip,
        status: "Failed",
      });
      return res.status(403).json({ message: "Your account is blocked" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await logActivity({
        userId: user._id,
        centerId: user.centerId,
        action: "Login Attempt",
        module: "Authentication",
        description: "Incorrect password",
        ipAddress: ip,
        status: "Failed",
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        roleId: user.roleId._id,
        centerId: user.centerId?._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Log successful login
    await logActivity({
      userId: user._id,
      centerId: user.centerId,
      action: "Login",
      module: "Authentication",
      description: `${user.username} logged in successfully`,
      ipAddress: ip,
      status: "Success",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.roleId?.name,
        center: user.centerId?.name,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Create User
exports.createUser = async (req, res) => {
  try {
    const { username, email, phone, password, confirmPassword, roleId, centerId } = req.body;

    if (!username || !email || !password || !confirmPassword || !roleId || !centerId)
      return res.status(400).json({ message: "All fields are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    // Password strength validation
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPassword.test(password))
      return res.status(400).json({
        message: "Password must contain uppercase, lowercase, number, special char, and be at least 8 characters long",
      });

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ username, email, phone, password, roleId, centerId });

    await logActivity({
      userId: req.user?.userId || null,
      centerId,
      action: "Create User",
      module: "User Management",
      description: `User ${username} created successfully`,
      ipAddress: req.ip,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//updateUserProfile
exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params; // user to update
    const { username, email, phone, password, roleId, centerId, status } = req.body;
    const updater = req.user; // from middleware
    const ip = req.ip;

    // Find the user to update
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const oldData = { ...user._doc };

    // Update allowed fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (roleId) user.roleId = roleId;
    if (centerId) user.centerId = centerId;
    if (status) user.status = status;

    // Password update (optional)
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    // Log the update in activity logs
    await logActivity({
      userId: updater._id,
      centerId: updater.centerId,
      action: "Update User Profile",
      module: "User Management",
      description: `Profile updated for user: ${user.username}`,
      ipAddress: ip,
      oldData,
      newData: updatedUser,
    });

    res.status(200).json({
      message: "User profile updated successfully",
      updatedUser: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        roleId: updatedUser.roleId,
        centerId: updatedUser.centerId,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    console.error("❌ Update user error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Get All Users (for user list)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const query = {};
    if (role && role !== "All") query.roleId = role;

    const users = await User.find(query)
      .populate("roleId", "name")
      .populate("centerId", "name")
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get User Stats (for dashboard counters)
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const blockedUsers = await User.countDocuments({ status: "Blocked" });

    const managerRole = await Role.findOne({ name: "Manager" });
    const agentRole = await Role.findOne({ name: "Agent" });

    const managers = managerRole ? await User.countDocuments({ roleId: managerRole._id }) : 0;
    const agents = agentRole ? await User.countDocuments({ roleId: agentRole._id }) : 0;

    res.json({ totalUsers, managers, agents, blockedUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Roles (for dropdown)
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ name: 1 });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Centers (for dropdown)
exports.getCenters = async (req, res) => {
  try {
    const centers = await Center.find().sort({ name: 1 });
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Block / Unblock user
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = user.status === "Active" ? "Blocked" : "Active";
    await user.save();

    await logActivity({
      userId: req.user?.userId || null,
      centerId: user.centerId,
      action: "User Status Change",
      module: "User Management",
      description: `${user.username} is now ${user.status}`,
      ipAddress: req.ip,
    });

    res.json({ message: `User ${user.status === "Active" ? "unblocked" : "blocked"} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
