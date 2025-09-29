import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { authData } = useContext(AuthContext);

  if (!authData) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && authData.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;
