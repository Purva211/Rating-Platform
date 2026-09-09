import { useEffect, useState } from "react";

import api from "../../services/api";

import Layout from "../../components/Layout";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/admin/dashboard");

        const data = response.data.data || response.data;

        setStats({
          totalUsers: data.totalUsers ?? data.total_users ?? 0,

          totalStores: data.totalStores ?? data.total_stores ?? 0,

          totalRatings: data.totalRatings ?? data.total_ratings ?? 0,
        });
      } catch (error) {
        setError(error.response?.data?.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <Layout>
      <div className="page">
        <h1 className="page-title">Dashboard</h1>

        <p className="page-subtitle">Overview of the rating platform.</p>

        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <div
            className="card"
            style={{
              marginTop: "22px",
            }}
          >
            Loading dashboard...
          </div>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Users</div>

              <div className="stat-value">{stats.totalUsers}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Total Stores</div>

              <div className="stat-value">{stats.totalStores}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Submitted Ratings</div>

              <div className="stat-value">{stats.totalRatings}</div>
            </div>
          </div>
        )}

        <div
          className="card"
          style={{
            marginTop: "22px",
          }}
        >
          <h3
            style={{
              marginTop: 0,
            }}
          >
            Platform overview
          </h3>

          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
              lineHeight: "1.6",
              marginBottom: 0,
            }}
          >
            Use the sidebar to manage users, stores and platform accounts.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
