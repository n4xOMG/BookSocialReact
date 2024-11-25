import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { fetchUserChats, fetchChatMessages, sendMessage } from "../../redux/chat/chat.action";
import { connectWebSocket, subscribeToChat, unsubscribeFromChat } from "../../redux/websocket/websocketActions";
import { List, ListItem, Typography, TextField, Button, Grid, Box, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"; // Updated import

const MessagesPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate(); // Initialized useNavigate
  const dispatch = useDispatch();
  const { chats, messages, loading, error } = useSelector((state) => state.chat, shallowEqual);
  const { stompClient, user } = useSelector(
    (state) => ({
      stompClient: state.websocket.stompClient,
      user: state.auth.user,
    }),
    shallowEqual
  );
  const [message, setMessage] = React.useState("");
  const messagesEndRef = useRef(null);

  // Fetch user chats and establish WebSocket connection
  useEffect(() => {
    dispatch(fetchUserChats());
    if (!stompClient) {
      dispatch(connectWebSocket());
    }
  }, [dispatch, stompClient]);

  // Subscribe to all chats after fetching them
  useEffect(() => {
    if (stompClient && stompClient.connected && user) {
      chats.forEach((chat) => {
        dispatch(subscribeToChat(chat.id));
      });
    }
  }, [chats, stompClient, dispatch, user]);

  // Fetch chat messages whenever chatId changes
  useEffect(() => {
    if (chatId) {
      dispatch(fetchChatMessages(chatId));
      dispatch(subscribeToChat(chatId)); // Ensure subscription to the selected chat
    }
  }, [chatId, dispatch]);

  // Cleanup subscriptions when chatId changes or component unmounts
  useEffect(() => {
    return () => {
      if (chatId) {
        dispatch(unsubscribeFromChat(chatId));
      }
    };
  }, [chatId, dispatch]);

  // Scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatId]);

  const handleSendMessage = () => {
    if (chatId && message.trim() !== "") {
      const selectedChat = chats.find((chat) => chat.id.toString() === chatId);
      if (!selectedChat) {
        console.error("Selected chat not found");
        return;
      }
      const receiver = selectedChat.userOne.id === user.id ? selectedChat.userTwo : selectedChat.userOne;
      const newMessage = {
        content: message,
        senderId: user.id,
        receiverId: receiver.id,
        chat: { id: parseInt(chatId) },
      };
      dispatch(sendMessage(chatId, newMessage));
      setMessage("");
    }
  };

  // Get messages for the current chatId
  const chatMessages = messages[chatId] || [];

  return (
    <Grid container>
      {/* Chats List */}
      <Grid
        item
        xs={4}
        style={{
          borderRight: "1px solid #ccc",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <List>
          {chats.map((chat) => (
            <ListItem
              key={chat.id}
              button
              onClick={() => navigate(`/chats/${chat.id}`)} // Updated navigation
              selected={chat.id.toString() === chatId}
            >
              <Typography variant="body1">{chat.userOne.id === user.id ? chat.userTwo.fullname : chat.userOne.fullname}</Typography>
            </ListItem>
          ))}
        </List>
      </Grid>

      {/* Messages Display */}
      <Grid
        item
        xs={8}
        style={{
          padding: "20px",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {chatId ? (
          <>
            {/* Messages List */}
            <List style={{ flexGrow: 1, overflowY: "auto" }}>
              {loading ? (
                <Box display="flex" justifyContent="center" mt={2}>
                  <CircularProgress />
                </Box>
              ) : chatMessages.length > 0 ? (
                chatMessages.map((msg) => {
                  const isSentByUser = msg.sender.id === user.id;
                  return (
                    <ListItem key={msg.id}>
                      <Box display="flex" flexDirection="column" alignItems={isSentByUser ? "flex-end" : "flex-start"} width="100%">
                        <Box
                          bgcolor={isSentByUser ? "#1976d2" : "#e0e0e0"}
                          color={isSentByUser ? "#fff" : "#000"}
                          p={1}
                          borderRadius={2}
                          maxWidth="60%"
                        >
                          <Typography variant="body2">{msg.content}</Typography>
                          {msg.imageUrl && (
                            <img
                              src={msg.imageUrl}
                              alt="sent"
                              style={{
                                maxWidth: "200px",
                                marginTop: "10px",
                                borderRadius: "8px",
                              }}
                            />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary" style={{ marginTop: "5px" }}>
                          {new Date(msg.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                    </ListItem>
                  );
                })
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" mt={2}>
                  No messages yet. Start the conversation!
                </Typography>
              )}
              <div ref={messagesEndRef} />
            </List>

            {/* Message Input */}
            <Box display="flex" marginTop="10px">
              <TextField
                variant="outlined"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <Button variant="contained" color="primary" onClick={handleSendMessage} style={{ marginLeft: "10px" }}>
                Send
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="h6" color="text.secondary" align="center" mt={10}>
            Select a chat to start messaging
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default MessagesPage;
