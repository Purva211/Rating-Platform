import { useEffect, useState } from "react";

import api from "../../services/api";

import Layout from "../../components/Layout";

const AdminStores = () => {
  const [stores, setStores] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState({
    name: "",
    address: "",
  });

  const [sort, setSort] = useState("name");

  const [order, setOrder] = useState("asc");

  const loadStores = async () => {
    try {
      setLoading(true);

      setError("");

      const params = new URLSearchParams();

      if (search.name) {
        params.append("name", search.name);
      }

      if (search.address) {
        params.append("address", search.address);
      }

      params.append("sort", sort);

      params.append("order", order);

      const response = await api.get(`/stores?${params.toString()}`);

      setStores(response.data.data || response.data.stores || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, [sort, order]);

  const handleChange = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    loadStores();
  };

  const clearSearch = () => {
    setSearch({
      name: "",
      address: "",
    });

    setTimeout(loadStores, 0);
  };

  const changeSorting = (field) => {
    if (sort === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(field);

      setOrder("asc");
    }
  };

  return (
    <Layout>
      <div className="page">
        <h1 className="page-title">Stores</h1>

        <p className="page-subtitle">
          View all stores registered on the platform.
        </p>

        {error && <div className="alert-error">{error}</div>}

        <div className="filter-box">
          <form onSubmit={handleSearch}>
            <div
              className="filter-grid"
              style={{
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <input
                className="input"
                name="name"
                value={search.name}
                onChange={handleChange}
                placeholder="Search by store name"
              />

              <input
                className="input"
                name="address"
                value={search.address}
                onChange={handleChange}
                placeholder="Search by address"
              />
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
                onClick={clearSearch}
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
            Loading stores...
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

                  <th>Email</th>

                  <th>
                    <button
                      className="sort-button"
                      onClick={() => changeSorting("address")}
                    >
                      Address
                    </button>
                  </th>

                  <th>Owner</th>

                  <th>
                    <button
                      className="sort-button"
                      onClick={() => changeSorting("rating")}
                    >
                      Rating
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                {stores.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">No stores found.</div>
                    </td>
                  </tr>
                ) : (
                  stores.map((store) => (
                    <tr key={store.id}>
                      <td>{store.id}</td>

                      <td>{store.name}</td>

                      <td>{store.email || "-"}</td>

                      <td>{store.address}</td>

                      <td>{store.owner_name || store.ownerName || "-"}</td>

                      <td>
                        <span className="rating">★</span>{" "}
                        {store.average_rating ?? store.rating ?? "0.0"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminStores;
