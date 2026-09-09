import { useState } from "react";

import api from "../services/api";

import Layout from "../components/Layout";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);

  const [showNew, setShowNew] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    setLoading(true);

    try {
      const response = await api.put("/user/password", formData);

      setSuccess(response.data.message || "Password updated successfully.");

      setFormData({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Unable to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page">
        <h1 className="page-title">Change Password</h1>

        <p className="page-subtitle">Update your account password.</p>

        {error && <div className="alert-error">{error}</div>}

        {success && <div className="alert-success">{success}</div>}

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Current Password</label>

              <div
                style={{
                  position: "relative",
                }}
              >
                <input
                  className="input"
                  type={showCurrent ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "#2563eb",
                    cursor: "pointer",
                  }}
                >
                  {showCurrent ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>

              <div
                style={{
                  position: "relative",
                }}
              >
                <input
                  className="input"
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="NewPassword@123"
                  minLength="8"
                  maxLength="16"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "#2563eb",
                    cursor: "pointer",
                  }}
                >
                  {showNew ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <p
              style={{
                color: "#6b7280",
                fontSize: "12px",
                lineHeight: "1.5",
              }}
            >
              Password must be 8–16 characters and contain at least one
              uppercase letter and one special character.
            </p>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ChangePassword;
