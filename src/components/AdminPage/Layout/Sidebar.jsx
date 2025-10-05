import {
  Book as BookIcon,
  Dashboard as DashboardIcon,
  MonetizationOn as MonetizationOnIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import CategoryIcon from "@mui/icons-material/Category";
import StyleIcon from "@mui/icons-material/Style";
import { Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: "Overview", icon: <DashboardIcon />, path: "/admin/overview" },
    { text: "Books Management", icon: <BookIcon />, path: "/admin/books" },
    { text: "User Management", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Report Management", icon: <ReportGmailerrorredIcon />, path: "/admin/reports" },
    { text: "Credits Management", icon: <MonetizationOnIcon />, path: "/admin/credits" },
    { text: "Payouts", icon: <MonetizationOnIcon />, path: "/admin/payouts" },
    { text: "Categories Management", icon: <CategoryIcon />, path: "/admin/categories" },
    { text: "Tags Management", icon: <StyleIcon />, path: "/admin/tags" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
