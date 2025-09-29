/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  });

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      
      localStorage.setItem("token", res.data.token);

      if (res.data && res.data.user) {
        const userData = {
          ...res.data.user,
          isAdmin: res.data.user.role === "admin",
        };
        setAuthData(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }

      return { success: true, message: "Login successful" };
    } catch (err) {
      
      const msg =
        err.response?.data?.message || "Invalid email or password";
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthData(null);
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};



