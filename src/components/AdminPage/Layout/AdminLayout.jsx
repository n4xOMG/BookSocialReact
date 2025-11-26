import { Box, Toolbar, useTheme } from "@mui/material";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ toggleTheme }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        backgroundAttachment: "fixed",
        backgroundImage: theme.palette.background.backgroundAdminImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <AdminSidebar />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <AdminHeader toggleTheme={toggleTheme} />

        <Toolbar />

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            p: 2,
            "& > *": {
              backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.3)"),
              backdropFilter: "blur(15px)",
              WebkitBackdropFilter: "blur(15px)",
              borderRadius: "20px",
              border: (theme) => `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.4)"}`,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
