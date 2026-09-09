import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  // User is not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // No role restriction
  if (allowedRoles.length === 0) {
    return children;
  }

  // User does not have permission
  if (!allowedRoles.includes(user?.role)) {
    if (user?.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    if (user?.role === "STORE_OWNER") {
      return <Navigate to="/owner" replace />;
    }

    return <Navigate to="/user" replace />;
  }

  return children;
};

export default ProtectedRoute;
