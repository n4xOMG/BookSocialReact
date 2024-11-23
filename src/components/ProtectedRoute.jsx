import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useRBAC from "../utils/useRBAC";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useSelector((state) => state.auth);
  const hasAccess = useRBAC(user, roles);

  return hasAccess ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
