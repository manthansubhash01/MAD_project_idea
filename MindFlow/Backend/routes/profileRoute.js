const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const authMiddleware = require('../middleware/authmiddleware')
const router = express.Router();

router.use(authMiddleware)

router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/changepassword", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/profile", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "User account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
