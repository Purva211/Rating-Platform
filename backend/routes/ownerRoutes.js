const express = require("express");

const { getOwnerDashboard } = require("../controllers/ownerController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  authenticate,
  authorize("STORE_OWNER"),
  getOwnerDashboard,
);

module.exports = router;
