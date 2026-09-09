import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const getClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-box">SR</div>

        <div>
          <strong>Store Rating</strong>

          <small>Platform</small>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-circle">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>

        <div className="user-info">
          <strong>{user?.name}</strong>

          <span>{user?.role}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {user?.role === "ADMIN" && (
          <>
            <NavLink to="/admin" className={getClass}>
              Dashboard
            </NavLink>

            <NavLink to="/admin/users" className={getClass}>
              Users
            </NavLink>

            <NavLink to="/admin/users/add" className={getClass}>
              Add User
            </NavLink>

            <NavLink to="/admin/stores" className={getClass}>
              Stores
            </NavLink>
          </>
        )}

        {user?.role === "USER" && (
          <>
            <NavLink to="/user" className={getClass}>
              Stores
            </NavLink>

            <NavLink to="/change-password" className={getClass}>
              Change Password
            </NavLink>
          </>
        )}

        {user?.role === "STORE_OWNER" && (
          <>
            <NavLink to="/owner" className={getClass}>
              Dashboard
            </NavLink>

            <NavLink to="/change-password" className={getClass}>
              Change Password
            </NavLink>
          </>
        )}
      </nav>

      <button className="sidebar-logout" onClick={logout}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
