// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on app load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/current-user`, {
          withCredentials: true,
        });

        if (response.data.user) {
          setCurrentUser(response.data.user);
        }
      } catch (err) {
        // User is not logged in, or token is invalid
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setError(null);
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { username, password },
        {
          withCredentials: true,
        }
      );

      setCurrentUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setCurrentUser(null);
    } catch (err) {
      setError(err.response?.data?.message || "Logout failed");
      throw err;
    }
  };

  // Register new user (admin or staff)
  const registerUser = async (userData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/register`, userData, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  // Get all users (for admin panel)
  const getUsers = async () => {
    try {
      setError(null);
      const response = await axios.get(`${API_URL}/auth/users`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
      throw err;
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    try {
      setError(null);
      const response = await axios.delete(`${API_URL}/auth/users/${userId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
      throw err;
    }
  };

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!currentUser) return false;

    if (Array.isArray(roles)) {
      return roles.includes(currentUser.role);
    }

    return currentUser.role === roles;
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    registerUser,
    getUsers,
    deleteUser,
    hasRole,
    isSystemAdmin: currentUser?.role === "systemAdmin",
    isAdmin:
      currentUser?.role === "admin" || currentUser?.role === "systemAdmin",
    isStaff: currentUser?.role === "staff",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
