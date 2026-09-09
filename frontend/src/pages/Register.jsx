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
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim();
    const cleanAddress = formData.address.trim();

    if (!cleanName || !cleanEmail || !cleanAddress || !formData.password) {
      return "All fields are required";
    }

    if (cleanName.length < 20 || cleanName.length > 60) {
      return "Name must be between 20 and 60 characters";
    }

    if (cleanAddress.length > 400) {
      return "Address cannot exceed 400 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return "Please enter a valid email address";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(formData.password)) {
      return "Password must be 8-16 characters and contain at least one uppercase letter and one special character";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/signup", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        address: formData.address.trim(),
        password: formData.password,
      });

      setSuccess(response.data.message || "Registration successful.");

      setFormData({
        name: "",
        email: "",
        address: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand-simple">
          <h1>Store Rating Platform</h1>

          <p>Create your account to get started</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {success && <div className="auth-success">{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>

            <input
              id="name"
              className="auth-input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              minLength={20}
              maxLength={60}
              placeholder="Enter your full name"
              required
            />

            <small className="field-hint">20–60 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              className="auth-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>

            <textarea
              id="address"
              className="auth-input auth-textarea"
              name="address"
              value={formData.address}
              onChange={handleChange}
              maxLength={400}
              placeholder="Enter your address"
              required
            />

            <small className="field-hint">Maximum 400 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-input-wrapper">
              <input
                id="password"
                className="auth-input"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                maxLength={16}
                placeholder="Password@123"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((previous) => !previous)}
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
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
