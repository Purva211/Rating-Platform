import { NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Layout.css";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  const navClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  return (
    <div className="app-layout">
      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-box">SR</div>

          <div>
            <strong>Store Rating</strong>

            <small>Platform</small>
          </div>
        </div>

        {/* USER */}

        <div className="sidebar-user">
          <div className="user-circle">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="user-info">
            <strong>{user?.name}</strong>

            <span>{user?.role}</span>
          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-nav">
          {user?.role === "ADMIN" && (
            <>
              <NavLink to="/admin" className={navClass}>
                Dashboard
              </NavLink>

              <NavLink to="/admin/users" className={navClass}>
                Users
              </NavLink>

              <NavLink to="/admin/users/add" className={navClass}>
                Add User
              </NavLink>

              <NavLink to="/admin/stores" className={navClass}>
                Stores
              </NavLink>
            </>
          )}

          {user?.role === "USER" && (
            <>
              <NavLink to="/user" className={navClass}>
                Stores
              </NavLink>
            </>
          )}

          {user?.role === "STORE_OWNER" && (
            <>
              <NavLink to="/owner" className={navClass}>
                Dashboard
              </NavLink>
            </>
          )}

          <NavLink to="/change-password" className={navClass}>
            Change Password
          </NavLink>
        </nav>

        {/* LOGOUT */}

        <button className="sidebar-logout" onClick={logout}>
          Logout
        </button>
      </aside>

      {/* MAIN */}

      <main className="main-content">
        <header className="top-header">
          <span className="top-header-title">Store Rating Platform</span>

          <span className="top-header-role">{user?.role}</span>
        </header>

        {children}
      </main>
    </div>
  );
};

export default Layout;
