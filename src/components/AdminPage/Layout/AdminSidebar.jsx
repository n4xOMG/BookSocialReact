import {
  Dashboard as DashboardIcon,
  Book as BookIcon,
  People as PeopleIcon,
  ReportGmailerrorred as ReportIcon,
  MonetizationOn as MoneyIcon,
  Category as CategoryIcon,
  Style as StyleIcon,
} from "@mui/icons-material";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
} from "@mui/material";
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
          backgroundColor: "background.paper",
        },
      }}
    >
      {/* Logo / Title */}
      <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="h6" fontWeight="bold">
          Admin Panel
        </Typography>
      </Toolbar>

      <Divider />

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
                  "&.Mui-selected": {
                    backgroundColor: (theme) => theme.palette.primary.main + "22",
                    "&:hover": {
                      backgroundColor: (theme) => theme.palette.primary.main + "33",
                    },
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
    </Drawer>
  );
};

export default AdminSidebar;
