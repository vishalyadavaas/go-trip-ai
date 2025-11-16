const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./models/Admin");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI)
  .then(()=>console.log("MongoDB connected"))
  .catch(err=>console.log(err));

async function createAdmin() {
  const hashed = await bcrypt.hash("RAHULSINGH", 10);
  const admin = new Admin({ username: "MANISH", password: hashed });
  await admin.save();
  console.log("Admin created");
  mongoose.connection.close();
}

createAdmin();
