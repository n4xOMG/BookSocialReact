import { Inbox } from "@mui/icons-material";
import { Avatar, Badge, Box, Divider, IconButton, Menu, Paper, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserChats } from "../../../redux/chat/chat.action";
import LoadingSpinner from "../../LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";

export default function MessageMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { chats, messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const getUserChat = (chat) => {
    if (!chat || !chat.userOne || !chat.userTwo) return null;
    return chat.userOne.id === user.id ? chat.userTwo : chat.userOne;
  };

  const getLastMessageContent = (chat) => {
    // Check Redux messages first (for real-time updates), then fallback to chat.messages
    const chatMessages = messages[chat.id] || chat.messages || [];
    if (chatMessages.length > 0) {
      const sortedMessages = [...chatMessages].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      const lastMessage = sortedMessages[0];
      if (lastMessage.content) {
        return lastMessage.content;
      }
      if (lastMessage.image) {
        return "📷 Image";
      }
    }
    return "No messages yet";
  };

  // Chats are sorted by the reducer - just create stable reference
  const sortedChats = useMemo(() => {
    if (!chats) return [];
    return [...chats];
  }, [chats]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchUserChats()).finally(() => setLoading(false));
  }, [dispatch]);

  return (
    <>
        <div>
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <Badge 
                variant={loading ? "dot" : "standard"}
                badgeContent={loading ? null : sortedChats?.length}
                color="primary"
                sx={{
                  opacity: loading ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}
            >
              <Inbox />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: { width: 320, maxHeight: 400, overflow: "auto", p: 2 },
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, fontSize: 22 }}>
              Messages
            </Typography>

            <Paper sx={{ maxHeight: 300, overflowY: "auto" }}>
              {loading ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ p: 2, textAlign: "center" }}
                >
                  Loading conversations...
                </Typography>
              ) : sortedChats?.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ p: 2, textAlign: "center" }}
                >
                  No messages yet
                </Typography>
              ) : (
              sortedChats?.map((chat, index) => {
                const otherUser = getUserChat(chat);

                return (
                  <React.Fragment key={chat?.id}>
                    <Box
                      onClick={() => {
                        navigate(`/chats/${chat.id}`);
                        handleClose();
                      }}
                      sx={{
                        backgroundColor: "background.paper",
                        cursor: "pointer",
                        px: 1,
                        py: 1,
                        display: "flex",
                        alignItems: "center",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <Avatar src={otherUser?.avatarUrl} sx={{ mr: 2 }} />
                      <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                        <Typography variant="body1" sx={{ fontWeight: "bold" }} noWrap>
                          {otherUser?.username || "Unknown"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                          noWrap
                        >
                          {getLastMessageContent(chat)}
                        </Typography>
                      </Box>
                    </Box>
                    {index < sortedChats.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })
              )}
            </Paper>
          </Menu>
        </div>
    </>
  );
}

