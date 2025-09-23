import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/HomePage/Header";
import Sidebar from "./components/HomePage/Sidebar";
import { Box, useTheme } from "@mui/material";

export default function Layout({
  toggleTheme,
  showSidebar = true,
  showHeader = true,
}) {
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        backgroundAttachment: "fixed",
        backgroundImage: theme.palette.background.backgroundImage, // ảnh bìa
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {showSidebar && (
        <Sidebar
          open={sidebarOpen}
          setOpen={handleSidebarToggle}
          toggleTheme={toggleTheme}
        />
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: "100vh",
        }}
      >
        {showHeader && <Header onSidebarToggle={handleSidebarToggle} />}
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          <Box sx={{ height: "100%" }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
