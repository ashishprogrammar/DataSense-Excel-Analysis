const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    let { username, email, password, adminCode } = req.body;
    // console.log(username, email, password, adminCode);


    email = email.toLowerCase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const assignedRole = adminCode === process.env.ADMIN_CODE ? 'admin' : 'user';

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: assignedRole,
    });

    res.status(201).json({
      message: "Registration successful",
      user: { id: user._id, username: user.username, role: user.role, email: user.email },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error during registration",
      error: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    
    if (user.blocked) {
      console.log("Blocked user tried to login:", user.email);
      return res.status(403).json({ message: "Your account is blocked. Contact admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        blocked: user.blocked, 
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
