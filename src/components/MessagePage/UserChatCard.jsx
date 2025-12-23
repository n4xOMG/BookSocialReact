import { DeleteOutline, MoreHorizRounded } from "@mui/icons-material";
import { 
  Avatar, 
  Badge,
  Card, 
  CardHeader, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  IconButton, 
  ListItemIcon, 
  ListItemText, 
  Menu, 
  MenuItem, 
  useTheme,
  Button,
  useMediaQuery,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteChat } from "../../redux/chat/chat.action";

export default function UserChatCard({ chat, isSelected, onChatDeleted, hasNewMessage = false, unreadCount = 0 }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const theme = useTheme();
  const userChat = chat.userOne.id === user.id ? chat.userTwo : chat.userOne;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuOpen = Boolean(menuAnchorEl);

  const getInitials = (u) => {
    if (!u || !u.username) return "?";
    return u.username.charAt(0).toUpperCase();
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e) => {
    if (e) e.stopPropagation();
    setMenuAnchorEl(null);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteChat(chat.id));
      setDeleteDialogOpen(false);
      if (onChatDeleted) {
        onChatDeleted(chat.id);
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card
        sx={{
          mb: isMobile ? 0 : 1.5,
          minWidth: isMobile ? 90 : "auto",
          maxWidth: isMobile ? 90 : "auto",
          p: isMobile ? 1 : 0,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          
          boxShadow: hasNewMessage ? "0 0 12px rgba(157, 80, 187, 0.4)" : "none",
          cursor: "pointer",
          transition: "all 0.3s ease",
          borderRadius: "16px",
          background: isSelected
            ? theme.palette.mode === "dark"
              ? "rgba(157, 80, 187, 0.2)"
              : "rgba(157, 80, 187, 0.15)"
            : hasNewMessage
            ? theme.palette.mode === "dark"
              ? "rgba(157, 80, 187, 0.12)"
              : "rgba(157, 80, 187, 0.08)"
            : theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid",
          borderColor: isSelected
            ? theme.palette.mode === "dark"
              ? "rgba(157, 80, 187, 0.5)"
              : "rgba(157, 80, 187, 0.4)"
            : hasNewMessage
            ? "rgba(157, 80, 187, 0.3)"
            : theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
          borderLeft: isSelected ? "4px solid #9d50bb" : hasNewMessage ? "4px solid #b968c7" : "none",
          animation: hasNewMessage ? "pulse 2s ease-in-out infinite" : "none",
          "@keyframes pulse": {
            "0%, 100%": { opacity: 1 },
            "50%": { opacity: 0.85 },
          },
          "&:hover": {
            background: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.15)" : "rgba(157, 80, 187, 0.1)",
            borderColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.4)" : "rgba(157, 80, 187, 0.3)",
            transform: "translateX(4px)",
          },
        }}
      >
        {isMobile ? (
          <Box sx={{ position: "relative", width: "100%" }}>
            {/* Menu */}
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{
                position: "absolute",
                top: -6,
                right: -6,
                zIndex: 2,
              }}
            >
              <MoreHorizRounded fontSize="small" />
            </IconButton>

            {/* Avatar */}
            <Badge
              badgeContent={unreadCount}
              invisible={unreadCount === 0}
              color="secondary"
            >
              <Avatar
                src={userChat.avatarUrl}
                sx={{
                  width: 48,
                  height: 48,
                  mx: "auto",
                  border: "2px solid #9d50bb",
                }}
              >
                {!userChat.avatarUrl && getInitials(userChat)}
              </Avatar>
            </Badge>

            {/* Username */}
            <Typography
              variant="caption"
              fontWeight={hasNewMessage ? 600 : 500}
              textAlign="center"
              noWrap
              sx={{ mt: 0.5 }}
            >
              {userChat.username}
            </Typography>
          </Box>
        ) : (
          <CardHeader
            action={
              <IconButton size="small" onClick={handleMenuClick}>
                <MoreHorizRounded fontSize="small" />
              </IconButton>
            }
            title={userChat.username}
            subheader={userChat.fullname}
            titleTypographyProps={{
              variant: "subtitle2",
              fontWeight: hasNewMessage ? "bold" : "medium",
              color: isSelected ? (theme.palette.mode === "light" ? "primary.dark" : "white") : "text.primary",
            }}
            subheaderTypographyProps={{
              variant: "caption",
              color: isSelected ? (theme.palette.mode === "light" ? "primary.dark" : "white") : "text.secondary",
              noWrap: true,
            }}
            avatar={
              <Badge
                badgeContent={unreadCount}
                color="secondary"
                invisible={unreadCount === 0}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#9d50bb",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "0.7rem",
                    minWidth: "18px",
                    height: "18px",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    border: "2px solid",
                    borderColor: hasNewMessage
                      ? "#9d50bb"
                      : isSelected
                      ? theme.palette.mode === "dark"
                        ? "rgba(157, 80, 187, 0.6)"
                        : "rgba(157, 80, 187, 0.5)"
                      : theme.palette.mode === "dark"
                      ? "rgba(157, 80, 187, 0.3)"
                      : "rgba(157, 80, 187, 0.2)",
                    boxShadow: hasNewMessage
                      ? "0 0 8px rgba(157, 80, 187, 0.5)"
                      : isSelected
                      ? "0 4px 12px rgba(157, 80, 187, 0.3)"
                      : "none",
                  }}
                  src={userChat.avatarUrl || "https://www.w3schools.com/howto/img_avatar.png"}
                >
                  {!userChat.avatarUrl && getInitials(userChat)}
                </Avatar>
              </Badge>
            }
          />
        )}
      </Card>

      {/* More Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          },
        }}
      >
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteOutline fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Chat</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: { borderRadius: "16px" },
        }}
      >
        <DialogTitle>Delete Chat?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete your conversation with {userChat.username}. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

