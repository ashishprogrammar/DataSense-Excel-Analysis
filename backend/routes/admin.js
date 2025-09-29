
const express = require("express");
const router = express.Router();
const checkAdmin = require("../middleware/checkAdmin");
const User = require("../models/User");
const { File, History } = require("../models/File");


router.get("/stats", checkAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    const totalUploads = await File.countDocuments();

    const chartTypes = await History.aggregate([
      { $group: { _id: "$chartType", count: { $sum: 1 } } },
    ]);

    res.json({ totalUsers, activeUsers, totalUploads, chartTypes });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/users", checkAdmin, async (req, res) => {
  const users = await User.find({}, "-password");
  res.json(users);
});


router.put("/users/:id/block", checkAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.role === "admin")
    return res.status(403).json({ message: "Cannot block an admin" });

  user.blocked = true;
  await user.save();
  res.json(user);
});

router.put("/users/:id/unblock", checkAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.role === "admin")
    return res.status(403).json({ message: "Cannot unblock an admin" }); // optional safeguard

  user.blocked = false;
  await user.save();
  res.json(user);
});


router.delete("/users/:id", checkAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.role === "admin")
    return res.status(403).json({ message: "Cannot delete an admin" });

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});


router.get("/files", checkAdmin, async (req, res) => {
  try {
    const files = await File.find().populate("userId", "username email");
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/files/:id", checkAdmin, async (req, res) => {
  try {
    await File.findByIdAndDelete(req.params.id);
    res.json({ message: "File deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/logs", checkAdmin, async (req, res) => {
  const logs = await Log.find().sort({ createdAt: -1 });
  res.json(logs);
});

module.exports = router;

