const express = require("express");

const {
  getStoresForUser,
  updatePassword,
} = require("../controllers/userController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Normal user store listing
router.get("/stores", authenticate, authorize("USER"), getStoresForUser);

// Password update
router.put(
  "/password",
  authenticate,
  authorize("USER", "ADMIN", "STORE_OWNER"),
  updatePassword,
);

module.exports = router;
