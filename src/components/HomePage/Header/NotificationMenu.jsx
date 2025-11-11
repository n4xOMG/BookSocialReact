import { Notifications, MarkChatRead } from "@mui/icons-material";
import { Badge, Box, Button, Divider, IconButton, Menu, Paper, Tooltip, Typography, CircularProgress } from "@mui/material";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getNotifications,
  loadMoreNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../../redux/notification/notification.action";
import LoadingSpinner from "../../LoadingSpinner";
import { formatExactTime, formatRelativeTime } from "../../../utils/formatDate";
import { useNavigate } from "react-router-dom";

const getNotificationDestination = (notification, currentUser) => {
  if (!notification) return null;

  if (notification.targetPath) return notification.targetPath;
  if (notification.targetUrl) return notification.targetUrl;

  const entityType = notification.notificationEntityType || notification.entityType;
  const entityId = notification.entityId;
  const meta = notification.metadata || notification.extraData || notification.data || {};
  const bookId = notification.bookId || meta.bookId || meta.parentBookId || meta.bookUUID || meta.bookUuid;
  const postId = notification.postId || meta.postId || meta.postUuid || meta.postUUID;

  switch (entityType) {
    case "BOOK":
      return entityId ? `/books/${entityId}` : bookId ? `/books/${bookId}` : "/";
    case "CHAPTER":
      if (bookId && entityId) {
        return `/books/${bookId}/chapters/${entityId}`;
      }
      return bookId ? `/books/${bookId}` : entityId ? `/books/${entityId}` : "/";
    case "COMMENT":
      if (postId) return `/posts/${postId}`;
      if (bookId) return `/books/${bookId}`;
      return entityId ? `/posts/${entityId}` : "/book-clubs";
    case "PAYMENT":
      return "/credit-packages";
    case "POST":
      return entityId ? `/posts/${entityId}` : postId ? `/posts/${postId}` : "/book-clubs";
    case "REPORT":
      if (currentUser?.roles?.some((role) => role === "ADMIN" || role === "ROLE_ADMIN" || role?.name === "ROLE_ADMIN")) {
        return "/admin/reports";
      }
      return "/";
    case "GLOBAL":
    default:
      return "/";
  }
};

export default function NotificationMenu() {
  const dispatch = useDispatch();
  const { notifications, loading, loadingMore, page, hasMore, totalElements } = useSelector((state) => state.notification);
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const observer = useRef();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  // Sort notifications by date
  const sortedNotifications = useMemo(() => {
    if (!notifications?.length) return [];

    return [...notifications].sort((a, b) => new Date(b.createdDate || b.time) - new Date(a.createdDate || a.time));
  }, [notifications]);

  const unreadCount = notifications?.filter((noti) => !noti.read)?.length || 0;

  // Handle notification menu click
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

    // Refresh notifications when opening the menu
    if (!anchorEl) {
      dispatch(getNotifications(0, 10));
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleNotificationClick = useCallback(
    (notification) => {
      if (!notification) return;

      const { id, read } = notification;

      if (id && !read) {
        dispatch(markNotificationAsRead(id));
      }

      const destination = getNotificationDestination(notification, user);

      setAnchorEl(null);

      if (destination) {
        navigate(destination);
      }
    },
    [dispatch, navigate, user]
  );

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        await dispatch(getNotifications(0, 10));
      } catch (e) {
        console.error("Error fetching notifications:", e);
      }
    };

    fetchNotifications();
  }, [dispatch]);

  // Load more notifications when scrolling
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      dispatch(loadMoreNotifications(page + 1, 10));
    }
  }, [dispatch, loadingMore, hasMore, page]);

  // Setup intersection observer for infinite scrolling
  const lastNotificationRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore, loadMore]
  );

  return (
    <>
      {loading && !notifications.length ? (
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
                Notifications {totalElements > 0 && `(${totalElements})`}
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
                <>
                  {sortedNotifications.map((noti, index) => (
                    <Box
                      key={noti?.id}
                      ref={index === sortedNotifications.length - 1 ? lastNotificationRef : null}
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
                      onClick={() => handleNotificationClick(noti)}
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
                        <Tooltip title={formatExactTime(noti?.createdDate)} placement="bottom">
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {formatRelativeTime(noti?.createdDate)}
                          </Typography>
                        </Tooltip>
                      </Box>
                      {index < sortedNotifications?.length - 1 && <Divider sx={{ mt: 2 }} />}
                    </Box>
                  ))}
                  {loadingMore && (
                    <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                      <CircularProgress size={24} />
                    </Box>
                  )}
                </>
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
