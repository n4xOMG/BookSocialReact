import {
  Dashboard as DashboardIcon,
  Book as BookIcon,
  People as PeopleIcon,
  ReportGmailerrorred as ReportIcon,
  MonetizationOn as MoneyIcon,
  Category as CategoryIcon,
  Style as StyleIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Box, Typography, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 240;

const menuItems = [
  { text: "Overview", icon: <DashboardIcon />, path: "/admin/overview" },
  { text: "Books Management", icon: <BookIcon />, path: "/admin/books" },
  { text: "User Management", icon: <PeopleIcon />, path: "/admin/users" },
  { text: "Report Management", icon: <ReportIcon />, path: "/admin/reports" },
  { text: "Credits Management", icon: <MoneyIcon />, path: "/admin/credits" },
  { text: "Payouts", icon: <MoneyIcon />, path: "/admin/payouts" },
  { text: "Categories Management", icon: <CategoryIcon />, path: "/admin/categories" },
  { text: "Tags Management", icon: <StyleIcon />, path: "/admin/tags" },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRight: (theme) => `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
          boxShadow: "4px 0 24px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {/* Logo / Title */}
      <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(45deg, #FFEB3B 30%, #FBC02D 90%)"
                : "linear-gradient(45deg, #1d6d53 30%, #4a8a75 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Admin Panel
        </Typography>
      </Toolbar>

      <Divider sx={{ backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)") }} />

      {/* Menu */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  transition: "all 0.3s ease",
                  "&.Mui-selected": {
                    backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 235, 59, 0.15)" : "rgba(29, 109, 83, 0.15)"),
                    backdropFilter: "blur(10px)",
                    border: (theme) => `1px solid ${theme.palette.primary.main}40`,
                    "&:hover": {
                      backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 235, 59, 0.25)" : "rgba(29, 109, 83, 0.25)"),
                    },
                  },
                  "&:hover": {
                    backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)"),
                    transform: "translateX(4px)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "primary.main" : "text.secondary",
                    minWidth: 36,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? "bold" : "normal",
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Return to Home Button */}
      <Box sx={{ p: 2 }}>
        <Divider
          sx={{ mb: 2, backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)") }}
        />
        <Button
          fullWidth
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate("/")}
          sx={{
            py: 1.5,
            borderRadius: 2,
            backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 235, 59, 0.15)" : "rgba(29, 109, 83, 0.15)"),
            backdropFilter: "blur(10px)",
            border: (theme) => `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 235, 59, 0.3)" : "rgba(29, 109, 83, 0.3)"}`,
            color: "primary.main",
            fontWeight: "bold",
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 235, 59, 0.25)" : "rgba(29, 109, 83, 0.25)"),
              transform: "translateY(-2px)",
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          Return to Home
        </Button>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
