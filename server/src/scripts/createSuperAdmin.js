import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../models/User.model.js";

const email = process.env.SUPER_ADMIN_EMAIL;
const password = process.env.SUPER_ADMIN_PASSWORD;
const name = process.env.SUPER_ADMIN_NAME || "Super Admin";

if (!email || !password) {
  console.error(" Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in your .env");
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" MongoDB connected");

    const existingUser = await User.findOne({ email }).select("+isSuperAdmin +password");

    if (existingUser) {
      existingUser.password = password;
      existingUser.isSuperAdmin = true;
      existingUser.name = name;
      await existingUser.save(); 
      console.log(` "${existingUser.name}" updated and granted Super Admin`);
    } else {
      const user = await User.create({ name, email, password, isSuperAdmin: true });
      console.log(` Super Admin created: ${name} (${email})`);
    }

    console.log(` Login at: http://localhost:5173/login`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`  Admin panel: http://localhost:5173/admin`);
    process.exit(0);
  } catch (error) {
    console.error(" Error:", error.message);
    process.exit(1);
  }
};

run();