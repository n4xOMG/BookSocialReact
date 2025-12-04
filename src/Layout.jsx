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
        height: "100vh",
        overflow: "hidden",
        backgroundAttachment: "fixed",
        backgroundImage: theme.palette.background.backgroundImage,
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
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: "100vh",
          // overflow: "hidden", // tránh lỗi scroll ngang
          overflowY: "auto"
        }}
      >
        {showHeader && <Header onSidebarToggle={handleSidebarToggle} />}
        <Box sx={{ flex: 1, minHeight: 0}}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
