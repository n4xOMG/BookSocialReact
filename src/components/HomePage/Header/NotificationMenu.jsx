import { Notifications, MarkChatRead } from "@mui/icons-material";
import { Badge, Box, Button, Divider, IconButton, Menu, Paper, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../../../redux/notification/notification.action";
import LoadingSpinner from "../../LoadingSpinner";
import { connectWebSocket, disconnectWebSocket } from "../../../services/websocket.service";

export default function NotificationMenu() {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notification);
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);

  // Remove useMemo and compute sortedNotifications inline:
  const sortedNotifications = notifications
    ? [...notifications].sort((a, b) => new Date(b.createdDate || b.time) - new Date(a.createdDate || a.time))
    : [];

  const unreadCount = notifications?.filter((noti) => !noti.read)?.length || 0;

  // Handle notification menu click
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        await dispatch(getNotifications());
      } catch (e) {
        console.error("Error fetching notifications:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [dispatch]);

  // Connect to WebSocket when component mounts
  useEffect(() => {
    if (user?.id) {
      connectWebSocket(user.username);

      return () => {
        disconnectWebSocket();
      };
    }
  }, [user]);

  // Format time to a more readable format
  const formatTime = (timeString) => {
    if (!timeString) return "Unknown time";

    try {
      // Parse ISO 8601 date string (what LocalDateTime typically returns from Java)
      const date = new Date(timeString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", timeString);
        return "Invalid date";
      }

      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

      if (diffInHours < 1) {
        return "Just now";
      } else if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) {
          return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
        } else {
          return date.toLocaleDateString();
        }
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date error";
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <Tooltip title="Notifications">
            <IconButton
              id="notifications-button"
              aria-controls={open ? "notifications-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{
                transition: "all 0.2s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <Badge
                badgeContent={unreadCount}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "10px",
                    height: "18px",
                    minWidth: "18px",
                    padding: "0 4px",
                  },
                }}
              >
                <Notifications color={open ? "primary" : "inherit"} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Menu
            id="notifications-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 3,
              sx: {
                width: 350,
                maxHeight: 480,
                overflow: "hidden",
                borderRadius: 2,
                mt: 1.5,
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ px: 3, py: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
              {notifications?.length > 0 && (
                <Button startIcon={<MarkChatRead />} size="small" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                  Mark all as read
                </Button>
              )}
            </Box>

            <Divider />

            <Paper
              elevation={0}
              sx={{
                maxHeight: 350,
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "4px",
                },
              }}
            >
              {sortedNotifications?.length > 0 ? (
                sortedNotifications.map((noti, index) => (
                  <Box
                    key={noti?.id}
                    sx={{
                      position: "relative",
                      backgroundColor: noti?.read ? "white" : "rgba(25, 118, 210, 0.05)",
                      color: "black",
                      cursor: "pointer",
                      p: 2,
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                      borderLeft: noti?.read ? "none" : "4px solid #1976d2",
                    }}
                    onClick={() => !noti.read && handleMarkAsRead(noti.id)}
                  >
                    {!noti?.read && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "error.main",
                        }}
                      />
                    )}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      <Typography variant="body1" sx={{ fontWeight: noti?.read ? 400 : 500 }}>
                        {noti?.message}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {formatTime(noti?.createdDate)}
                      </Typography>
                    </Box>
                    {index < sortedNotifications?.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4, px: 2 }}>
                  <Notifications sx={{ fontSize: 40, color: "text.disabled", mb: 2 }} />
                  <Typography variant="body1" sx={{ color: "text.secondary", textAlign: "center" }}>
                    You have no notifications
                  </Typography>
                </Box>
              )}
            </Paper>
          </Menu>
        </div>
      )}
    </>
  );
}
