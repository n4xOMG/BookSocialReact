import { Inbox } from "@mui/icons-material";
import { Avatar, Badge, Box, Divider, IconButton, Menu, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserChats } from "../../../redux/chat/chat.action";
import LoadingSpinner from "../../LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";

export default function MessageMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { chats } = useSelector((state) => state.chat);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const getLastMessageContent = (chat) => {
    if (chat.messages && chat.messages.length > 0) {
      const lastMessage = chat.messages[chat.messages.length - 1];
      return lastMessage.content;
    }
    return null;
  };
  useEffect(() => {
    setLoading(true);
    try {
      dispatch(fetchUserChats());
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <Badge badgeContent={4} color="primary">
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
              {chats?.map((chat, index) => (
                <Box
                  key={chat?.id}
                  onClick={() => navigate(`/chats/${chat?.id}`)}
                  sx={{
                    backgroundColor: "white",
                    color: "black",
                    cursor: "pointer",
                    px: 1,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    "&:hover": {
                      backgroundColor: "#f2f2f2",
                      color: "black",
                    },
                  }}
                >
                  <Avatar src={chat?.userOne?.avatarUrl} sx={{ mr: 2 }} />
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {chat?.userOne?.username}
                    </Typography>
                    <Typography variant="body2">{getLastMessageContent(chat)}</Typography>
                  </Box>
                  {index < chats?.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              ))}
            </Paper>
          </Menu>
        </div>
      )}
    </>
  );
}
