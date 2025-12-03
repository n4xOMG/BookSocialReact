import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useRBAC from "../utils/useRBAC";
import { Box, CircularProgress } from "@mui/material";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const hasAccess = useRBAC(user, roles);

  // While auth state is loading, avoid redirect flicker
  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return hasAccess ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
