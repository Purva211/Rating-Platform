import { useEffect, useState } from "react";

import api from "../../services/api";

import Layout from "../../components/Layout";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);

  const [search, setSearch] = useState({
    name: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

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

      const response = await api.get(`/user/stores?${params.toString()}`);

      setStores(response.data.data || response.data.stores || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  const submitRating = async (storeId, rating) => {
    try {
      await api.post("/ratings", {
        storeId,
        rating,
      });

      loadStores();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit rating");
    }
  };

  const modifyRating = async (storeId, rating) => {
    try {
      await api.put(`/ratings/${storeId}`, {
        rating,
      });

      loadStores();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update rating");
    }
  };

  return (
    <Layout>
      <div className="page">
        <h1 className="page-title">Stores</h1>

        <p className="page-subtitle">Search stores and submit your rating.</p>

        {error && <div className="alert-error">{error}</div>}

        <div className="filter-box">
          <form
            onSubmit={(e) => {
              e.preventDefault();

              loadStores();
            }}
          >
            <div
              className="filter-grid"
              style={{
                gridTemplateColumns: "1fr 1fr auto",
              }}
            >
              <input
                className="input"
                placeholder="Store name"
                value={search.name}
                onChange={(e) =>
                  setSearch({
                    ...search,
                    name: e.target.value,
                  })
                }
              />

              <input
                className="input"
                placeholder="Address"
                value={search.address}
                onChange={(e) =>
                  setSearch({
                    ...search,
                    address: e.target.value,
                  })
                }
              />

              <button className="btn btn-primary" type="submit">
                Search
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
          <div
            style={{
              marginTop: "22px",
            }}
          >
            {stores.length === 0 ? (
              <div className="card">
                <div className="empty-state">No stores found.</div>
              </div>
            ) : (
              stores.map((store) => (
                <div
                  className="card"
                  key={store.id}
                  style={{
                    marginBottom: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "25px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                      }}
                    >
                      <h3
                        style={{
                          margin: "0 0 8px",
                          color: "#172033",
                        }}
                      >
                        {store.name}
                      </h3>

                      <p
                        style={{
                          margin: "0 0 10px",
                          color: "#6b7280",
                          fontSize: "14px",
                        }}
                      >
                        {store.address}
                      </p>

                      <div>
                        <span className="rating">★</span>{" "}
                        <strong>
                          {store.overall_rating ??
                            store.average_rating ??
                            "0.0"}
                        </strong>
                        <span className="rating-number">Overall rating</span>
                      </div>
                    </div>

                    <div
                      style={{
                        minWidth: "210px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#6b7280",
                          marginBottom: "8px",
                        }}
                      >
                        Your rating
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((rating) => {
                          const current =
                            store.my_rating || store.user_rating || 0;

                          return (
                            <button
                              key={rating}
                              className="btn btn-secondary"
                              style={{
                                padding: "6px 9px",
                                color:
                                  rating <= current ? "#f59e0b" : "#6b7280",
                              }}
                              onClick={() => {
                                if (current) {
                                  modifyRating(store.id, rating);
                                } else {
                                  submitRating(store.id, rating);
                                }
                              }}
                            >
                              ★
                            </button>
                          );
                        })}
                      </div>

                      <div
                        style={{
                          marginTop: "7px",
                          color: "#9ca3af",
                          fontSize: "12px",
                        }}
                      >
                        {store.my_rating || store.user_rating
                          ? `You rated ${
                              store.my_rating || store.user_rating
                            }/5`
                          : "Click a star to rate"}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserDashboard;
