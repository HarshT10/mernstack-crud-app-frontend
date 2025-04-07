// src/components/ProtectedRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  // Show loading indicator while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if user is authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If no specific roles are required, or user has the required role
  if (!allowedRoles || allowedRoles.includes(currentUser.role)) {
    return <Outlet />;
  }

  // User is authenticated but doesn't have the required role
  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;
