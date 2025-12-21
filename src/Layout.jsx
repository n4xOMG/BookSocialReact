import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/HomePage/Header";
import Sidebar from "./components/HomePage/Sidebar";
import { Box, useTheme } from "@mui/material";
import Footer from "./components/HomePage/Footer";

export default function Layout({
  toggleTheme,
  showSidebar = true,
  showHeader = true,
  showFooter = true,
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
          overflow: "visible", // tránh lỗi scroll ngang
          overflowY: "auto"
        }}
      >
        {showHeader && <Header onSidebarToggle={handleSidebarToggle} />}
        <Box sx={{ flex: 1}}>
          <Outlet />
        </Box>
        {showFooter && <Footer/> }
      </Box>
    </Box>
  );
}
