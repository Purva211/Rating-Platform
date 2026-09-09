const pool = require("../config/db");

const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [stores] = await pool.query(
      `SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating,
        COUNT(r.id) AS total_ratings
       FROM stores s
       LEFT JOIN ratings r
         ON s.id = r.store_id
       WHERE s.owner_id = ?
       GROUP BY
        s.id,
        s.name,
        s.email,
        s.address`,
      [ownerId],
    );

    const [ratings] = await pool.query(
      `SELECT
        s.name AS store_name,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        r.rating,
        r.created_at
       FROM ratings r
       JOIN users u
         ON r.user_id = u.id
       JOIN stores s
         ON r.store_id = s.id
       WHERE s.owner_id = ?
       ORDER BY r.created_at DESC`,
      [ownerId],
    );

    return res.status(200).json({
      success: true,
      data: {
        stores,
        ratings,
      },
    });
  } catch (error) {
    console.error("Owner dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load owner dashboard",
    });
  }
};

module.exports = {
  getOwnerDashboard,
};
