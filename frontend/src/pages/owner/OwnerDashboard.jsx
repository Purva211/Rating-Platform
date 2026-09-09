import { useEffect, useState } from "react";

import api from "../../services/api";

import Layout from "../../components/Layout";

const OwnerDashboard = () => {
  const [data, setData] = useState({
    stores: [],
    ratings: [],
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/owner/dashboard");

        const result = response.data.data || response.data;

        setData({
          stores: result.stores || [],

          ratings: result.ratings || result.users || [],
        });
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="page">
          <div className="card">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <h1 className="page-title">Store Owner Dashboard</h1>

        <p className="page-subtitle">
          Monitor your store ratings and customers.
        </p>

        {error && <div className="alert-error">{error}</div>}

        <div className="stats-grid">
          {data.stores.length === 0 ? (
            <div className="stat-card">
              <div className="stat-label">Store</div>

              <div
                style={{
                  marginTop: "10px",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                No store assigned.
              </div>
            </div>
          ) : (
            data.stores.map((store) => (
              <div className="stat-card" key={store.id}>
                <div className="stat-label">{store.name}</div>

                <div className="stat-value">
                  <span className="rating">★</span>{" "}
                  {store.average_rating ?? store.rating ?? "0.0"}
                </div>

                <div
                  style={{
                    marginTop: "6px",
                    color: "#9ca3af",
                    fontSize: "12px",
                  }}
                >
                  {store.total_ratings ?? store.rating_count ?? 0} ratings
                </div>
              </div>
            ))
          )}
        </div>

        <div
          className="table-container"
          style={{
            marginTop: "25px",
          }}
        >
          <div
            style={{
              padding: "18px 18px 5px",
            }}
          >
            <h3
              style={{
                margin: "0 0 5px",
              }}
            >
              Customer Ratings
            </h3>

            <p
              style={{
                color: "#9ca3af",
                fontSize: "13px",
                marginTop: "5px",
              }}
            >
              Users who submitted ratings for your store.
            </p>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Store</th>

                <th>Customer</th>

                <th>Email</th>

                <th>Rating</th>

                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {data.ratings.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">No ratings submitted yet.</div>
                  </td>
                </tr>
              ) : (
                data.ratings.map((rating, index) => (
                  <tr key={rating.id || index}>
                    <td>{rating.store_name || rating.storeName || "-"}</td>

                    <td>{rating.user_name || rating.userName || "-"}</td>

                    <td>{rating.user_email || rating.userEmail || "-"}</td>

                    <td>
                      <span className="rating">
                        {"★".repeat(Number(rating.rating) || 0)}
                      </span>{" "}
                      {rating.rating}/5
                    </td>

                    <td>
                      {rating.created_at
                        ? new Date(rating.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default OwnerDashboard;
