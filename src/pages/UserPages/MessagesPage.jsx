import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Divider } from "@mui/material";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import NotificationList from "../components/NotificationList";
import { useDispatch, useSelector } from "react-redux";
import { connectWebSocket, disconnectWebSocket } from "../../redux/websocket/websocketActions";
import { getNotifications } from "../../redux/notification/notification.action";

const MessagesPage = () => {
  const dispatch = useDispatch();
  const [selectedChat, setSelectedChat] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(connectWebSocket());
      dispatch(getNotifications());

      return () => {
        dispatch(disconnectWebSocket());
      };
    }
  }, [dispatch, user]);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Chat List */}
      <ChatList selectedChat={selectedChat} setSelectedChat={setSelectedChat} />

      <Divider orientation="vertical" flexItem />

      <Grid container sx={{ flex: 1 }}>
        {selectedChat ? (
          <ChatWindow chatId={selectedChat} />
        ) : (
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Select a chat to start messaging
            </Typography>
          </Box>
        )}
      </Grid>

      {/* Notifications */}
      <NotificationList />
    </Box>
  );
};

export default MessagesPage;
