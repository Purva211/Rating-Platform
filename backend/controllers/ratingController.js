
const pool = require("../config/db");

// Submit a new rating
const submitRating = async (req, res) => {
  try {
    const userId = req.user.id;

    const { storeId, rating } = req.body;

    if (!storeId || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "storeId and rating are required",
      });
    }

    const numericStoreId = Number(storeId);
    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericStoreId) ||
      numericStoreId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid storeId",
      });
    }

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }

    // Check whether store exists
    const [stores] = await pool.query(
      "SELECT id FROM stores WHERE id = ?",
      [numericStoreId]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // Check whether user already rated this store
    const [existingRating] = await pool.query(
      `SELECT id
       FROM ratings
       WHERE user_id = ?
       AND store_id = ?`,
      [userId, numericStoreId]
    );

    if (existingRating.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "You have already rated this store. Use modify rating instead.",
      });
    }

    // Insert rating
    await pool.query(
      `INSERT INTO ratings
       (user_id, store_id, rating)
       VALUES (?, ?, ?)`,
      [userId, numericStoreId, numericRating]
    );

    return res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
    });
  } catch (error) {
    console.error("Submit rating error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit rating",
    });
  }
};

// Modify an existing rating
const modifyRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = Number(req.params.storeId);
    const { rating } = req.body;

    // Validate store ID
    if (
      !Number.isInteger(storeId) ||
      storeId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid storeId",
      });
    }

    const numericRating = Number(rating);

    // Validate rating
    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }

    // Check whether store exists
    const [stores] = await pool.query(
      "SELECT id FROM stores WHERE id = ?",
      [storeId]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // Check whether user has already rated this store
    const [existingRating] = await pool.query(
      `SELECT id
       FROM ratings
       WHERE user_id = ?
       AND store_id = ?`,
      [userId, storeId]
    );

    if (existingRating.length === 0) {
      return res.status(404).json({
        success: false,
        message: "You have not rated this store yet",
      });
    }

    // Update rating
    await pool.query(
      `UPDATE ratings
       SET rating = ?
       WHERE user_id = ?
       AND store_id = ?`,
      [numericRating, userId, storeId]
    );

    return res.status(200).json({
      success: true,
      message: "Rating updated successfully",
    });
  } catch (error) {
    console.error("Modify rating error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update rating",
    });
  }
};

module.exports = {
  submitRating,
  modifyRating,
};
