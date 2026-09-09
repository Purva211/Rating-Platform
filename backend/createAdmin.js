require("dotenv").config({
  path: __dirname + "/.env",
});

const bcrypt = require("bcryptjs");
const pool = require("./config/db");

const createAdmin = async () => {
  try {
    const name = "System Administrator Account";

    const email = "admin@example.com";

    const password = "Admin@123";

    const address = "System Administration Office";

    // Check whether admin already exists

    const [existingAdmin] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingAdmin.length > 0) {
      console.log("Admin already exists");

      process.exit(0);
    }

    // Hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin

    await pool.query(
      `INSERT INTO users
            (name, email, password, address, role)
            VALUES (?, ?, ?, ?, 'ADMIN')`,
      [name, email, hashedPassword, address],
    );

    console.log("Admin created successfully");

    console.log("Email:", email);

    console.log("Password:", password);

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);

    process.exit(1);
  }
};

createAdmin();
