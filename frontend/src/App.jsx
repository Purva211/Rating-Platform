import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import Register from "./pages/Register";

import ChangePassword from "./pages/ChangePassword";

import AdminDashboard from "./pages/admin/AdminDashboard";

import AdminUsers from "./pages/admin/AdminUsers";

import AddUser from "./pages/admin/AddUser";

import UserDetails from "./pages/admin/UserDetails";

import AdminStores from "./pages/admin/AdminStores";

import UserDashboard from "./pages/user/UserDashboard";

import OwnerDashboard from "./pages/owner/OwnerDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/add"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AddUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/stores"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminStores />
            </ProtectedRoute>
          }
        />

        {/* NORMAL USER */}

        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* STORE OWNER */}

        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* CHANGE PASSWORD */}

        <Route
          path="/change-password"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN", "STORE_OWNER"]}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* DEFAULT */}

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
