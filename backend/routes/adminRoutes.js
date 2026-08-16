const express = require("express");

const {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  createUserByAdmin,
  createAdminByAdmin,
  createStoreOwner,
} = require("../controllers/adminController");

const authenticate = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================================
// ADMIN DASHBOARD
// GET /api/admin/dashboard
// =====================================================

router.get("/dashboard", authenticate, authorize("ADMIN"), getDashboardStats);

// =====================================================
// GET ALL USERS
// GET /api/admin/users
// =====================================================

router.get("/users", authenticate, authorize("ADMIN"), getAllUsers);

// =====================================================
// GET USER DETAILS
// GET /api/admin/users/:id
// =====================================================

router.get("/users/:id", authenticate, authorize("ADMIN"), getUserDetails);

// =====================================================
// CREATE NORMAL USER
// POST /api/admin/users
// =====================================================

router.post("/users", authenticate, authorize("ADMIN"), createUserByAdmin);

// =====================================================
// CREATE ADMIN
// POST /api/admin/admins
// =====================================================

router.post("/admins", authenticate, authorize("ADMIN"), createAdminByAdmin);

// =====================================================
// CREATE STORE OWNER
// POST /api/admin/store-owners
// =====================================================

router.post(
  "/store-owners",
  authenticate,
  authorize("ADMIN"),
  createStoreOwner,
);

module.exports = router;
