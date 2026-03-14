const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

async function seedUsers() {

  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const users = [

      {
        name: "Admin User",
        email: "admin@test.com",
        password: "123456",
        role: "admin"
      },

      {
        name: "Manager User",
        email: "manager@test.com",
        password: "123456",
        role: "manager"
      },

      {
        name: "Sales User",
        email: "sales@test.com",
        password: "123456",
        role: "sales"
      },

      {
        name: "Test Sales",
        email: "test@test.com",
        password: "123456",
        role: "sales"
      }

    ];

    await User.deleteMany({});

    for (let user of users) {

      const hashedPassword = await bcrypt.hash(user.password, 10);

      await User.create({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role
      });

    }

    console.log("Sample users created successfully");

    process.exit();

  } catch (err) {

    console.error(err);
    process.exit(1);

  }

}

seedUsers();