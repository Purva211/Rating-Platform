import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import api from "../../services/api";

import Layout from "../../components/Layout";

const UserDetails = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await api.get(`/admin/users/${id}`);

        setUser(response.data.data || response.data.user || response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="page">
          <div className="card">Loading user...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <Link to="/admin/users" className="btn btn-secondary">
          Back to Users
        </Link>

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <h1 className="page-title">User Details</h1>

          <p className="page-subtitle">Account information.</p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        {user && (
          <div
            className="card"
            style={{
              maxWidth: "700px",
              marginTop: "22px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "160px 1fr",
                gap: "15px",
                fontSize: "14px",
              }}
            >
              <strong>Name</strong>

              <span>{user.name}</span>

              <strong>Email</strong>

              <span>{user.email}</span>

              <strong>Address</strong>

              <span>{user.address}</span>

              <strong>Role</strong>

              <span>
                <span
                  className={
                    user.role === "ADMIN"
                      ? "badge badge-admin"
                      : user.role === "STORE_OWNER"
                        ? "badge badge-owner"
                        : "badge badge-user"
                  }
                >
                  {user.role}
                </span>
              </span>

              {user.role === "STORE_OWNER" && (
                <>
                  <strong>Store Rating</strong>

                  <span>
                    <span className="rating">★</span>{" "}
                    {user.rating ?? user.average_rating ?? "N/A"}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserDetails;
