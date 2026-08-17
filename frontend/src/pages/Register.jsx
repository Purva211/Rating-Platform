import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

import "./auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

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
      const response = await api.post("/auth/register", formData);

      setSuccess(response.data.message || "Registration successful.");

      setFormData({
        name: "",
        email: "",
        address: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="brand-content">
            <div className="brand-logo">SR</div>

            <h1>Join Store Rating</h1>

            <p>Create your account and start sharing your store experiences.</p>

            <div className="brand-features">
              <div className="brand-feature">
                <span>✓</span>
                Simple registration
              </div>

              <div className="brand-feature">
                <span>✓</span>
                Rate registered stores
              </div>

              <div className="brand-feature">
                <span>✓</span>
                Manage your ratings
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-section">
          <div className="auth-header">
            <h2>Create account</h2>

            <p>Enter your details below.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {success && <div className="auth-success">{success}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>

              <input
                className="auth-input no-icon"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                minLength="20"
                maxLength="60"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                className="auth-input no-icon"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Address</label>

              <textarea
                className="auth-input no-icon auth-textarea"
                name="address"
                value={formData.address}
                onChange={handleChange}
                maxLength="400"
                placeholder="Enter your address"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <div className="input-wrapper">
                <input
                  className="auth-input no-icon"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="8"
                  maxLength="16"
                  placeholder="Password@123"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <small className="password-hint">
                8–16 characters, one uppercase letter and one special character.
              </small>
            </div>

            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account?
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
