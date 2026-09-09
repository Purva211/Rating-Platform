import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import Layout from "../../components/Layout";

const AddUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER",
  });

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
      let endpoint;

      if (formData.role === "USER") {
        endpoint = "/admin/users";
      } else if (formData.role === "ADMIN") {
        endpoint = "/admin/admins";
      } else {
        endpoint = "/admin/store-owners";
      }

      const response = await api.post(endpoint, {
        name: formData.name,

        email: formData.email,

        address: formData.address,

        password: formData.password,
      });

      setSuccess(response.data.message || "User created successfully.");

      setFormData({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "USER",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page">
        <h1 className="page-title">Add User</h1>

        <p className="page-subtitle">
          Create a normal user, admin or store owner.
        </p>

        {error && <div className="alert-error">{error}</div>}

        {success && <div className="alert-success">{success}</div>}

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>

              <input
                className="input"
                name="name"
                value={formData.name}
                onChange={handleChange}
                minLength="20"
                maxLength="60"
                placeholder="Enter full name"
                required
              />

              <small>20–60 characters</small>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>

              <input
                className="input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>

              <textarea
                className="textarea"
                name="address"
                value={formData.address}
                onChange={handleChange}
                maxLength="400"
                placeholder="Enter address"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>

              <input
                className="input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password@123"
                minLength="8"
                maxLength="16"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>

              <select
                className="select"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="USER">Normal User</option>

                <option value="ADMIN">Admin</option>

                <option value="STORE_OWNER">Store Owner</option>
              </select>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create User"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/admin/users")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddUser;
