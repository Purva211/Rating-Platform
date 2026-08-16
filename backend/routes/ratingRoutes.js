const express = require("express");

const {
  submitRating,
  modifyRating,
} = require("../controllers/ratingController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Submit rating
router.post("/", authenticate, authorize("USER"), submitRating);

// Modify rating
router.put("/:storeId", authenticate, authorize("USER"), modifyRating);

module.exports = router;
