const pool = require("../config/db");
const bcrypt = require("bcryptjs");

// Get stores for normal user
const getStoresForUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, address, sort = "name", order = "asc" } = req.query;

    let whereClause = "WHERE 1 = 1";
    const values = [userId];

    if (name) {
      whereClause += " AND s.name LIKE ?";
      values.push(`%${name}%`);
    }

    if (address) {
      whereClause += " AND s.address LIKE ?";
      values.push(`%${address}%`);
    }

    const allowedSortFields = {
      name: "s.name",
      address: "s.address",
      rating: "overall_rating",
    };

    const sortField = allowedSortFields[sort] || "s.name";

    const sortOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";

    const [stores] = await pool.query(
      `SELECT
        s.id,
        s.name,
        s.address,
        COALESCE(
          ROUND(AVG(all_ratings.rating), 2),
          0
        ) AS overall_rating,
        my_rating.rating AS my_rating
      FROM stores s
      LEFT JOIN ratings all_ratings
        ON s.id = all_ratings.store_id
      LEFT JOIN ratings my_rating
        ON s.id = my_rating.store_id
        AND my_rating.user_id = ?
      ${whereClause}
      GROUP BY
        s.id,
        s.name,
        s.address,
        my_rating.rating
      ORDER BY ${sortField} ${sortOrder}`,
      values,
    );

    return res.status(200).json({
      success: true,
      count: stores.length,
      data: stores,
    });
  } catch (error) {
    console.error("Get user stores error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch stores",
    });
  }
};

// Update password
const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be 8-16 characters and contain at least one uppercase letter and one special character",
      });
    }

    const [users] = await pool.query(
      `SELECT id, password
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

    // Check current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Check whether new password is same as old password
    const samePassword = await bcrypt.compare(newPassword, user.password);

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users
       SET password = ?
       WHERE id = ?`,
      [hashedPassword, userId],
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update password error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update password",
    });
  }
};

module.exports = {
  getStoresForUser,
  updatePassword,
};
