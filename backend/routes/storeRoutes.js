const express = require("express");

const { createStore, getAllStores } = require("../controllers/storeController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", authenticate, authorize("ADMIN"), createStore);

router.get("/", authenticate, authorize("ADMIN"), getAllStores);

module.exports = router;
