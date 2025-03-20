// scripts/createAdmin.js
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const admin = await Admin.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });

    console.log("Admin created:", admin);
    mongoose.disconnect();
  } catch (error) {
    console.error("Error creating admin:", error);
    mongoose.disconnect();
  }
};

createAdmin();
