import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, List, ListItem, ListItemText, TextField, Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatMessages, sendMessage } from "../../redux/chat/chat.action";
import { subscribeToChat, unsubscribeFromChat } from "../../redux/websocket/websocketActions";

const ChatWindow = ({ chatId }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages[chatId] || []);
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.chat);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchChatMessages(chatId));
    dispatch(subscribeToChat(chatId));

    return () => {
      dispatch(unsubscribeFromChat(chatId));
    };
  }, [dispatch, chatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    dispatch(sendMessage(chatId, newMessage));
    setNewMessage("");
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Chat Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
        <Typography variant="h6">Chat with {chatId}</Typography>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
        <List>
          {messages.map((msg) => (
            <ListItem
              key={msg.id}
              sx={{
                justifyContent: msg.senderId === user.id ? "flex-end" : "flex-start",
              }}
            >
              <ListItemText
                primary={msg.content}
                secondary={new Date(msg.timestamp).toLocaleString()}
                sx={{
                  textAlign: msg.senderId === user.id ? "right" : "left",
                  backgroundColor: msg.senderId === user.id ? "#DCF8C6" : "#FFF",
                  borderRadius: 2,
                  padding: 1,
                  maxWidth: "60%",
                }}
              />
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Message Input */}
      <Box sx={{ p: 2, borderTop: "1px solid #ddd", display: "flex" }}>
        <TextField
          variant="outlined"
          placeholder="Type your message..."
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
              e.preventDefault();
            }
          }}
        />
        <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatWindow;
