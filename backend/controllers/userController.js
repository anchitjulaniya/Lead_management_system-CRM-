const User = require("../models/User");

exports.getUsers = async (req, res) => {

  try {

    const users = await User.find().select("-password");

    res.json({
      data: users
    });

  } catch (err) {

    res.status(500).json({
      message: "Server error"
    });

  }

};


exports.updateUserRole = async (req, res) => {

  try {

    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "User role updated",
      user
    });

  } catch (err) {

    res.status(500).json({
      message: "Server error"
    });

  }

};