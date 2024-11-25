import { AccountBalanceWallet, History, Logout, Settings, AdminPanelSettings } from "@mui/icons-material";
import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAction } from "../../../redux/auth/auth.action";
import { getOptimizedImageUrl } from "../../../utils/optimizeImages";

export default function ProfileMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    dispatch(logoutAction());
    navigate("/sign-in");
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateToAdmin = () => {
    navigate("/admin/overview");
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            {user && user?.avatarUrl ? (
              <Avatar src={getOptimizedImageUrl(user?.avatarUrl)} sx={{ width: 32, height: 32, mr: 2 }} />
            ) : (
              <Avatar>{user?.username[0]}</Avatar>
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {user
          ? [
              <MenuItem disabled key="credits">
                <ListItemIcon>
                  <AccountBalanceWallet fontSize="small" />
                </ListItemIcon>
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    Credits: {user.credits}
                  </Typography>
                </Box>
              </MenuItem>,
              <Divider key="divider-credits" />,
              <MenuItem divider onClick={() => navigate("/profile")} key="profile">
                <Avatar src={user.avatarUrl} /> Profile
              </MenuItem>,
              <MenuItem onClick={handleClose} key="reading-history">
                <ListItemIcon>
                  <History fontSize="small" />
                </ListItemIcon>
                Reading History
              </MenuItem>,
              user.role && user.role.name === "ADMIN" && (
                <MenuItem onClick={navigateToAdmin} key="admin-dashboard">
                  <ListItemIcon>
                    <AdminPanelSettings fontSize="small" />
                  </ListItemIcon>
                  Admin Dashboard
                </MenuItem>
              ),
              <MenuItem onClick={handleClose} key="settings">
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>,
              <MenuItem onClick={handleLogout} key="logout">
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>,
            ]
          : [
              <MenuItem key="login" onClick={() => navigate("/sign-in")}>
                Sign in
              </MenuItem>,
            ]}
      </Menu>
    </>
  );
}
