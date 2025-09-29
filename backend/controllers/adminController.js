// controllers/adminController.js
const User = require("../models/User");
const File = require("../models/File");

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 7*24*60*60*1000) }
    });
    const totalUploads = await File.countDocuments();

    res.json({ totalUsers, activeUsers, totalUploads });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
