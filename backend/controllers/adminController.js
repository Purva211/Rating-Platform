const pool = require("../config/db");
const bcrypt = require("bcryptjs");

// =====================================================
// ADMIN DASHBOARD
// GET /api/admin/dashboard
// =====================================================

const getDashboardStats = async (req, res) => {
  try {
    // Get total number of users
    const [userResult] = await pool.query(
      "SELECT COUNT(*) AS totalUsers FROM users",
    );

    // Get total number of stores
    const [storeResult] = await pool.query(
      "SELECT COUNT(*) AS totalStores FROM stores",
    );

    // Get total number of ratings
    const [ratingResult] = await pool.query(
      "SELECT COUNT(*) AS totalRatings FROM ratings",
    );

    return res.status(200).json({
      success: true,
      data: {
        totalUsers: userResult[0].totalUsers,
        totalStores: storeResult[0].totalStores,
        totalRatings: ratingResult[0].totalRatings,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics",
    });
  }
};

// =====================================================
// GET ALL USERS
// GET /api/admin/users
// =====================================================

const getAllUsers = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      role,
      sort = "name",
      order = "asc",
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Math.max(parseInt(page, 10) || 1, 1);

    const recordsPerPage = Math.min(
      Math.max(parseInt(limit, 10) || 10, 1),
      100,
    );

    const offset = (currentPage - 1) * recordsPerPage;

    let whereClause = "WHERE 1 = 1";
    const values = [];

    // -----------------------------
    // Filters
    // -----------------------------

    if (name) {
      whereClause += " AND name LIKE ?";
      values.push(`%${name}%`);
    }

    if (email) {
      whereClause += " AND email LIKE ?";
      values.push(`%${email}%`);
    }

    if (address) {
      whereClause += " AND address LIKE ?";
      values.push(`%${address}%`);
    }

    if (role) {
      const allowedRoles = ["USER", "ADMIN", "STORE_OWNER"];

      if (allowedRoles.includes(role)) {
        whereClause += " AND role = ?";
        values.push(role);
      }
    }

    // -----------------------------
    // Sorting
    // -----------------------------

    const allowedSortFields = {
      name: "name",
      email: "email",
      address: "address",
      role: "role",
      created_at: "created_at",
    };

    const sortField = allowedSortFields[sort] || "name";

    const sortOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";

    // -----------------------------
    // Total records
    // -----------------------------

    const [countResult] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM users
       ${whereClause}`,
      values,
    );

    const totalRecords = countResult[0].total;

    // -----------------------------
    // Get users
    // -----------------------------

    const [users] = await pool.query(
      `SELECT
        id,
        name,
        email,
        address,
        role,
        created_at
       FROM users
       ${whereClause}
       ORDER BY ${sortField} ${sortOrder}
       LIMIT ? OFFSET ?`,
      [...values, recordsPerPage, offset],
    );

    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    return res.status(200).json({
      success: true,
      pagination: {
        currentPage,
        recordsPerPage,
        totalRecords,
        totalPages,
      },
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// =====================================================
// GET USER DETAILS
// GET /api/admin/users/:id
// =====================================================

const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    const [users] = await pool.query(
      `SELECT
        id,
        name,
        email,
        address,
        role,
        created_at
       FROM users
       WHERE id = ?`,
      [userId],
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    let storeDetails = null;

    // If user is a store owner,
    // get their store and average rating
    if (user.role === "STORE_OWNER") {
      const [stores] = await pool.query(
        `SELECT
          s.id,
          s.name,
          s.email,
          s.address,
          COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating
         FROM stores s
         LEFT JOIN ratings r
           ON s.id = r.store_id
         WHERE s.owner_id = ?
         GROUP BY
           s.id,
           s.name,
           s.email,
           s.address`,
        [userId],
      );

      storeDetails = stores;
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
        stores: storeDetails,
      },
    });
  } catch (error) {
    console.error("Get user details error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
};

// =====================================================
// CREATE NORMAL USER BY ADMIN
// POST /api/admin/users
// =====================================================

const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    // -----------------------------
    // Required fields
    // -----------------------------

    if (!name || !email || !address || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // -----------------------------
    // Clean input
    // -----------------------------

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanAddress = address.trim();

    // -----------------------------
    // Name validation
    // 20 - 60 characters
    // -----------------------------

    if (cleanName.length < 20 || cleanName.length > 60) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 20 and 60 characters",
      });
    }

    // -----------------------------
    // Address validation
    // Maximum 400 characters
    // -----------------------------

    if (cleanAddress.length > 400) {
      return res.status(400).json({
        success: false,
        message: "Address cannot exceed 400 characters",
      });
    }

    // -----------------------------
    // Email validation
    // -----------------------------

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // -----------------------------
    // Password validation
    //
    // 8 - 16 characters
    // At least one uppercase
    // At least one special character
    // -----------------------------

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be 8-16 characters and contain at least one uppercase letter and one special character",
      });
    }

    // -----------------------------
    // Check duplicate email
    // -----------------------------

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [cleanEmail],
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // -----------------------------
    // Hash password
    // -----------------------------

    const hashedPassword = await bcrypt.hash(password, 10);

    // -----------------------------
    // Insert normal user
    // -----------------------------

    const [result] = await pool.query(
      `INSERT INTO users
        (name, email, password, address, role)
       VALUES (?, ?, ?, ?, 'USER')`,
      [cleanName, cleanEmail, hashedPassword, cleanAddress],
    );

    // -----------------------------
    // Success response
    // -----------------------------

    return res.status(201).json({
      success: true,
      message: "Normal user created successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Create user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

// =====================================================
// CREATE ADMIN BY ADMIN
// POST /api/admin/admins
// =====================================================

const createAdminByAdmin = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    // ---------------------------------------------
    // Check required fields
    // ---------------------------------------------

    if (!name || !email || !address || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ---------------------------------------------
    // Clean input
    // ---------------------------------------------

    const cleanName = name.trim();

    const cleanEmail = email.trim().toLowerCase();

    const cleanAddress = address.trim();

    // ---------------------------------------------
    // Validate name
    // ---------------------------------------------

    if (cleanName.length < 20 || cleanName.length > 60) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 20 and 60 characters",
      });
    }

    // ---------------------------------------------
    // Validate address
    // ---------------------------------------------

    if (cleanAddress.length > 400) {
      return res.status(400).json({
        success: false,
        message: "Address cannot exceed 400 characters",
      });
    }

    // ---------------------------------------------
    // Validate email
    // ---------------------------------------------

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // ---------------------------------------------
    // Validate password
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
    // Check duplicate email
    // ---------------------------------------------

    const [existingUser] = await pool.query(
      `SELECT id
                 FROM users
                 WHERE email = ?`,
      [cleanEmail],
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // ---------------------------------------------
    // Hash password
    // ---------------------------------------------

    const hashedPassword = await bcrypt.hash(password, 10);

    // ---------------------------------------------
    // Insert ADMIN
    // ---------------------------------------------

    const [result] = await pool.query(
      `INSERT INTO users
                (
                    name,
                    email,
                    password,
                    address,
                    role
                )
                VALUES (?, ?, ?, ?, 'ADMIN')`,
      [cleanName, cleanEmail, hashedPassword, cleanAddress],
    );

    // ---------------------------------------------
    // Success response
    // ---------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Create admin error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create admin",
    });
  }
};

// =====================================================
// CREATE STORE OWNER BY ADMIN
// POST /api/admin/store-owners
// =====================================================

const createStoreOwner = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    // ---------------------------------------------
    // Check required fields
    // ---------------------------------------------

    if (!name || !email || !address || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ---------------------------------------------
    // Clean input
    // ---------------------------------------------

    const cleanName = name.trim();

    const cleanEmail = email.trim().toLowerCase();

    const cleanAddress = address.trim();

    // ---------------------------------------------
    // Validate name
    // ---------------------------------------------

    if (cleanName.length < 20 || cleanName.length > 60) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 20 and 60 characters",
      });
    }

    // ---------------------------------------------
    // Validate address
    // ---------------------------------------------

    if (cleanAddress.length > 400) {
      return res.status(400).json({
        success: false,
        message: "Address cannot exceed 400 characters",
      });
    }

    // ---------------------------------------------
    // Validate email
    // ---------------------------------------------

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // ---------------------------------------------
    // Validate password
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
    // Check duplicate email
    // ---------------------------------------------

    const [existingUser] = await pool.query(
      `SELECT id
                 FROM users
                 WHERE email = ?`,
      [cleanEmail],
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // ---------------------------------------------
    // Hash password
    // ---------------------------------------------

    const hashedPassword = await bcrypt.hash(password, 10);

    // ---------------------------------------------
    // Create Store Owner
    // ---------------------------------------------

    const [result] = await pool.query(
      `INSERT INTO users
                (
                    name,
                    email,
                    password,
                    address,
                    role
                )
                VALUES (?, ?, ?, ?, 'STORE_OWNER')`,
      [cleanName, cleanEmail, hashedPassword, cleanAddress],
    );

    // ---------------------------------------------
    // Success
    // ---------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Store owner created successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Create store owner error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create store owner",
    });
  }
};

// =====================================================
// EXPORT FUNCTIONS
// =====================================================
module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  createUserByAdmin,
  createAdminByAdmin,
  createStoreOwner,
};
