const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// =====================================================
// REGISTER NORMAL USER
// POST /api/auth/register
// =====================================================

const register = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    console.log("Registration request:", req.body);

    // ---------------------------------------------
    // 1. Check required fields
    // ---------------------------------------------

    if (!name || !email || !address || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ---------------------------------------------
    // 2. Clean input
    // ---------------------------------------------

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanAddress = address.trim();

    // ---------------------------------------------
    // 3. Validate name
    // Requirement:
    // Minimum 20 characters
    // Maximum 60 characters
    // ---------------------------------------------

    if (cleanName.length < 20 || cleanName.length > 60) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 20 and 60 characters",
      });
    }

    // ---------------------------------------------
    // 4. Validate address
    // Maximum 400 characters
    // ---------------------------------------------

    if (cleanAddress.length > 400) {
      return res.status(400).json({
        success: false,
        message: "Address cannot exceed 400 characters",
      });
    }

    // ---------------------------------------------
    // 5. Validate email
    // ---------------------------------------------

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // ---------------------------------------------
    // 6. Validate password
    //
    // Requirements:
    // 8-16 characters
    // At least one uppercase letter
    // At least one special character
    // ---------------------------------------------

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be 8-16 characters and contain at least one uppercase letter and one special character",
      });
    }

    // ---------------------------------------------
    // 7. Check whether email already exists
    // ---------------------------------------------

    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [cleanEmail],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // ---------------------------------------------
    // 8. Hash password
    // ---------------------------------------------

    const hashedPassword = await bcrypt.hash(password, 10);

    // ---------------------------------------------
    // 9. Create normal user
    //
    // IMPORTANT:
    // We don't take role from req.body.
    // Every public registration becomes USER.
    // ---------------------------------------------

    const [result] = await pool.query(
      `INSERT INTO users
            (name, email, password, address, role)
            VALUES (?, ?, ?, ?, 'USER')`,
      [cleanName, cleanEmail, hashedPassword, cleanAddress],
    );

    // ---------------------------------------------
    // 10. Send response
    // ---------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle MySQL duplicate email error
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request:", {
      email,
      passwordProvided: !!password,
    });

    // ---------------------------------------------
    // 1. Check required fields
    // ---------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ---------------------------------------------
    // 2. Clean email
    // ---------------------------------------------

    const cleanEmail = email.trim().toLowerCase();

    // ---------------------------------------------
    // 3. Validate email format
    // ---------------------------------------------

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // ---------------------------------------------
    // 4. Find user
    // ---------------------------------------------

    const [users] = await pool.query(
      `SELECT
                id,
                name,
                email,
                password,
                address,
                role
             FROM users
             WHERE email = ?`,
      [cleanEmail],
    );

    // ---------------------------------------------
    // 5. User doesn't exist
    // ---------------------------------------------

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    // ---------------------------------------------
    // 6. Compare password
    // ---------------------------------------------

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ---------------------------------------------
    // 7. Create JWT
    // ---------------------------------------------

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // ---------------------------------------------
    // 8. Return user information
    //
    // NEVER return hashed password.
    // ---------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// =====================================================
// EXPORT FUNCTIONS
// =====================================================

module.exports = {
  register,
  login,
};
