import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import api from "../../services/api";

import Layout from "../../components/Layout";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });

  const [sort, setSort] = useState("name");

  const [order, setOrder] = useState("asc");

  const [page, setPage] = useState(1);

  const limit = 10;

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  });

  const loadUsers = async () => {
    try {
      setLoading(true);

      setError("");

      const params = new URLSearchParams();

      if (filters.name) {
        params.append("name", filters.name);
      }

      if (filters.email) {
        params.append("email", filters.email);
      }

      if (filters.address) {
        params.append("address", filters.address);
      }

      if (filters.role) {
        params.append("role", filters.role);
      }

      params.append("sort", sort);

      params.append("order", order);

      params.append("page", page);

      params.append("limit", limit);

      const response = await api.get(`/admin/users?${params.toString()}`);

      const data = response.data.data || response.data.users || [];

      setUsers(data);

      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, sort, order]);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);

    loadUsers();
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      email: "",
      address: "",
      role: "",
    });

    setPage(1);

    setTimeout(loadUsers, 0);
  };

  const changeSorting = (field) => {
    if (sort === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(field);

      setOrder("asc");
    }
  };

  const roleClass = (role) => {
    if (role === "ADMIN") {
      return "badge badge-admin";
    }

    if (role === "STORE_OWNER") {
      return "badge badge-owner";
    }

    return "badge badge-user";
  };

  return (
    <Layout>
      <div className="page">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 className="page-title">Users</h1>

            <p className="page-subtitle">View and manage platform users.</p>
          </div>

          <Link to="/admin/users/add" className="btn btn-primary">
            Add User
          </Link>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <div className="filter-box">
          <form onSubmit={handleSearch}>
            <div className="filter-grid">
              <input
                className="input"
                name="name"
                placeholder="Name"
                value={filters.name}
                onChange={handleChange}
              />

              <input
                className="input"
                name="email"
                placeholder="Email"
                value={filters.email}
                onChange={handleChange}
              />

              <input
                className="input"
                name="address"
                placeholder="Address"
                value={filters.address}
                onChange={handleChange}
              />

              <select
                className="select"
                name="role"
                value={filters.role}
                onChange={handleChange}
              >
                <option value="">All Roles</option>

                <option value="USER">Normal User</option>

                <option value="ADMIN">Admin</option>

                <option value="STORE_OWNER">Store Owner</option>
              </select>
            </div>

            <div
              style={{
                marginTop: "14px",
                display: "flex",
                gap: "8px",
              }}
            >
              <button className="btn btn-primary" type="submit">
                Search
              </button>

              <button
                className="btn btn-secondary"
                type="button"
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div
            className="card"
            style={{
              marginTop: "20px",
            }}
          >
            Loading users...
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>

                  <th>
                    <button
                      className="sort-button"
                      onClick={() => changeSorting("name")}
                    >
                      Name
                      {sort === "name" && (order === "asc" ? " ↑" : " ↓")}
                    </button>
                  </th>

                  <th>
                    <button
                      className="sort-button"
                      onClick={() => changeSorting("email")}
                    >
                      Email
                      {sort === "email" && (order === "asc" ? " ↑" : " ↓")}
                    </button>
                  </th>

                  <th>Address</th>

                  <th>
                    <button
                      className="sort-button"
                      onClick={() => changeSorting("role")}
                    >
                      Role
                      {sort === "role" && (order === "asc" ? " ↑" : " ↓")}
                    </button>
                  </th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">No users found.</div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>

                      <td>{user.name}</td>

                      <td>{user.email}</td>

                      <td>{user.address}</td>

                      <td>
                        <span className={roleClass(user.role)}>
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="btn btn-secondary"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="pagination">
          <span className="pagination-info">
            Page {pagination.currentPage || page} of{" "}
            {pagination.totalPages || 1}
          </span>

          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <button
              className="btn btn-secondary"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>

            <button
              className="btn btn-secondary"
              disabled={page >= (pagination.totalPages || 1)}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsers;
