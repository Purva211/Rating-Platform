const pool = require("../config/db");

// =====================================================
// CREATE STORE
// POST /api/stores
// =====================================================

const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !email || !address || !ownerId) {
      return res.status(400).json({
        success: false,
        message: "Name, email, address and ownerId are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanAddress = address.trim();

    if (cleanAddress.length > 400) {
      return res.status(400).json({
        success: false,
        message: "Address cannot exceed 400 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid store email",
      });
    }

    // Check owner
    const [owners] = await pool.query(
      `SELECT id
             FROM users
             WHERE id = ?
             AND role = 'STORE_OWNER'`,
      [ownerId],
    );

    if (owners.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a valid store owner",
      });
    }

    // Check duplicate store email
    const [existing] = await pool.query(
      "SELECT id FROM stores WHERE email = ?",
      [cleanEmail],
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Store email already exists",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO stores
            (name, email, address, owner_id)
            VALUES (?, ?, ?, ?)`,
      [cleanName, cleanEmail, cleanAddress, ownerId],
    );

    return res.status(201).json({
      success: true,
      message: "Store created successfully",
      storeId: result.insertId,
    });
  } catch (error) {
    console.error("Create store error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create store",
    });
  }
};

const getAllStores = async (req, res) => {
  try {
    const { name, address, sort = "name", order = "asc" } = req.query;

    let whereClause = "WHERE 1 = 1";

    const values = [];

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
      email: "s.email",
      address: "s.address",
      rating: "average_rating",
    };

    const sortField = allowedSortFields[sort] || "s.name";

    const sortOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";

    const [stores] = await pool.query(
      `SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                u.name AS owner_name,
                COALESCE(
                    ROUND(AVG(r.rating), 2),
                    0
                ) AS average_rating
             FROM stores s
             JOIN users u
                ON s.owner_id = u.id
             LEFT JOIN ratings r
                ON s.id = r.store_id
             ${whereClause}
             GROUP BY
                s.id,
                s.name,
                s.email,
                s.address,
                u.name
             ORDER BY ${sortField} ${sortOrder}`,
      values,
    );

    return res.status(200).json({
      success: true,
      count: stores.length,
      data: stores,
    });
  } catch (error) {
    console.error("Get stores error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch stores",
    });
  }
};
module.exports = {
  createStore,
  getAllStores,
};
