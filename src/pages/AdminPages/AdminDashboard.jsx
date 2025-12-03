import React, { useState } from "react";
import { Box, Toolbar, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, useTheme, Divider, IconButton, AppBar, Avatar } from "@mui/material";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  LibraryBooks as BooksIcon,
  Category as CategoryIcon,
  LocalOffer as TagIcon,
  Assessment as ReportIcon,
  CreditCard as CreditIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
} from "@mui/icons-material";

import BooksTab from "../../components/AdminPage/Dashboard/BooksTab";
import CategoriesTab from "../../components/AdminPage/Dashboard/CategoriesTab";
import CreditsManagement from "../../components/AdminPage/Dashboard/CreditsManagement";
import Overview from "../../components/AdminPage/Dashboard/Overview";
import ReportsManagement from "../../components/AdminPage/Dashboard/ReportsManagement";
import PayoutsManagement from "../../components/AdminPage/Dashboard/PayoutsManagement";
import TagsTab from "../../components/AdminPage/Dashboard/TagsTab";
import UserManagement from "../../components/AdminPage/Dashboard/UserManagement";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../redux/auth/auth.action";

const drawerWidth = 280;

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Overview", icon: <DashboardIcon />, path: "/admin/overview" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Books", icon: <BooksIcon />, path: "/admin/books" },
    { text: "Categories", icon: <CategoryIcon />, path: "/admin/categories" },
    { text: "Tags", icon: <TagIcon />, path: "/admin/tags" },
    { text: "Payouts", icon: <MoneyIcon />, path: "/admin/payouts" },
    { text: "Credits", icon: <CreditIcon />, path: "/admin/credits" },
    { text: "Reports", icon: <ReportIcon />, path: "/admin/reports" },
  ];

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/");
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: theme.palette.background.paper }}>
      <Toolbar sx={{ px: 3, py: 2 }}>
        <Typography variant="h5" className="font-serif" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          BookSocial Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, px: 2, py: 2 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname.includes(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isSelected}
                sx={{
                  borderRadius: "12px",
                  "&.Mui-selected": {
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    "&:hover": {
                      bgcolor: theme.palette.primary.dark,
                    },
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.primary.contrastText,
                    },
                  },
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isSelected ? theme.palette.primary.contrastText : theme.palette.text.secondary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={() => navigate("/")}
          sx={{
            borderRadius: "12px",
            mb: 1,
            color: theme.palette.text.secondary,
            "&:hover": {
              bgcolor: theme.palette.action.hover,
              color: theme.palette.text.primary,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Back to Home" primaryTypographyProps={{ fontWeight: 600 }} />
        </ListItemButton>

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: "12px",
            color: theme.palette.error.main,
            "&:hover": {
              bgcolor: theme.palette.error.light + "20",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: theme.palette.error.main }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: theme.palette.background.default }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: "none",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="subtitle1" fontWeight="600">
              Admin
            </Typography>
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>A</Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, borderRight: `1px solid ${theme.palette.divider}` },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Routes>
          <Route
            path="/overview"
            element={
              <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
                <Overview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
                <ReportsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payouts"
            element={
              <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
                <PayoutsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books"
            element={
              <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
                <BooksTab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/credits"
            element={
              <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
                <CreditsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
                <CategoriesTab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tags"
            element={
              <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
                <TagsTab />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
