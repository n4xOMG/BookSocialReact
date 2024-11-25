import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchChatMessages, sendMessage } from "../../redux/chat/chat.action";
import { UploadToCloudinary } from "../../utils/uploadToCloudinary";
import { connectWebSocket } from "../../redux/websocket/websocketActions";

const MessagePage = () => {
  const { chatId } = useParams();
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chat, shallowEqual);
  const { stompClient } = useSelector((state) => state.websocket, shallowEqual);
  const { user } = useSelector((state) => state.auth, shallowEqual);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchChatMessages(chatId));
    if (!stompClient) {
      dispatch(connectWebSocket());
    }
  }, [dispatch, chatId, stompClient]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (message.trim() === "" && !image) return;

    let imageUrl = "";
    if (image) {
      try {
        imageUrl = await UploadToCloudinary(image, "chat_images");
      } catch (err) {
        console.error("Image upload failed:", err);
        return;
      }
    }

    const msg = {
      chatId,
      content: imageUrl ? `${message} <image:${imageUrl}>` : message,
      timestamp: new Date().toISOString(),
      senderId: user.id,
      receiverId: chatId, // Adjust based on your chat structure
      isRead: false,
    };

    dispatch(sendMessage(chatId, msg));
    setMessage("");
    setImage(null);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4">Chat</Typography>
      </Box>
      <Grid container direction="column" spacing={2} sx={{ height: "70vh", overflowY: "auto" }}>
        <Grid item>
          {loading && <Typography>Loading messages...</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          <List>
            {messages &&
              messages.map((msg) => (
                <ListItem key={msg.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar src={msg.sender.avatarUrl} alt={msg.sender.username} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={msg.sender.username}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.primary">
                          {msg.content.includes("<image:") ? (
                            <>
                              {msg.content.split("<image:")[0]}
                              <img
                                src={msg.content.split("<image:")[1].replace(">", "")}
                                alt="sent"
                                style={{ maxWidth: "200px", marginTop: "10px" }}
                              />
                            </>
                          ) : (
                            msg.content
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(msg.timestamp).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            <div ref={messagesEndRef} />
          </List>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={10}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton component="label" color="primary">
              <ImageIcon />
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </IconButton>
            <Button variant="contained" color="primary" endIcon={<SendIcon />} onClick={handleSendMessage} sx={{ ml: 1 }}>
              Send
            </Button>
          </Grid>
        </Grid>
        {image && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">Image selected: {image.name}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MessagePage;
