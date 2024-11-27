import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import WestIcon from "@mui/icons-material/West";
import { Avatar, Box, Button, CircularProgress, Grid, IconButton, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatMessage from "../../components/MessagePage/ChatMessage";
import SearchUser from "../../components/MessagePage/SearchUser";
import UserChatCard from "../../components/MessagePage/UserChatCard";
import { createMessage, fetchUserChats } from "../../redux/chat/chat.action";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import UploadToCloudinary from "../../utils/uploadToCloudinary";
import { useNavigate } from "react-router-dom";

export default function MessagesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chats } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUserChats());
  }, [dispatch]);

  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCreateMessage = async (value) => {
    if (isSending) return;
    setIsSending(true);
    setLoading(true);
    let imgUrl = null;
    if (selectedImage) {
      imgUrl = await UploadToCloudinary(selectedImage, `chat/chat_images/${currentChat.id}`);
    }
    const message = {
      chat: { id: currentChat.id },
      chatId: currentChat.id,
      sender: { id: user.id },
      receiver: { id: currentChat.userOne === user.id ? user.id : currentChat.userTwo.id },
      content: value,
      imageUrl: imgUrl,
    };
    dispatch(createMessage({ message, sendMessageToServer }));
    setSelectedImage(null);
    setImagePreview(null);
    setLoading(false);
    setIsSending(false);
  };

  useEffect(() => {
    const socket = new SockJS("http://localhost:80/ws");
    const stomp = Stomp.over(socket);
    setStompClient(stomp);
    stomp.connect({}, onConnect, onErr);
  }, []);

  const onConnect = () => {
    console.log("Connected to WebSocket");
    if (stompClient && user && currentChat) {
      console.log(`Subscribing to group: /group/${currentChat.id}/private`);
      stompClient.subscribe(`/group/${currentChat.id}/private`, onMessageReceived);
    }
  };

  const onErr = (err) => {
    console.log("Websocket error: ", err);
  };

  const sendMessageToServer = (newMessage) => {
    if (stompClient && newMessage) {
      stompClient.send(`/app/chat/${currentChat?.id.toString()}`, {}, JSON.stringify(newMessage));
    }
  };

  const onMessageReceived = (payload) => {
    console.log("Message received from WebSocket:", payload.body);
    const receivedMessage = JSON.parse(payload.body);
    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
  };

  useEffect(() => {
    if (stompClient && user && currentChat) {
      const subscription = stompClient.subscribe(`/group/${currentChat.id}/private`, onMessageReceived);
      return () => subscription.unsubscribe();
    }
  }, [stompClient, user, currentChat]);

  useEffect(() => {
    if (currentChat) {
      setMessages(currentChat.messages);
    }
  }, [currentChat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Grid container sx={{ height: "100vh", overflow: "hidden" }}>
      <Grid item xs={3} sx={{ px: 3, bgcolor: "#f5f5f5", borderRight: "1px solid #ddd" }}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", py: 2 }} onClick={() => navigate("/")}>
            <IconButton>
              <WestIcon />
            </IconButton>
            <Typography sx={{ fontSize: 20, fontWeight: "bold", ml: 1 }}>Home</Typography>
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 2 }}>
            <SearchUser />
            <Box sx={{ mt: 2 }}>
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setCurrentChat(chat);
                  }}
                >
                  <UserChatCard chat={chat} />
                </div>
              ))}
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={9} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {currentChat ? (
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", p: 2, borderBottom: "1px solid #ddd" }}>
              <Avatar src="https://www.w3schools.com/howto/img_avatar.png" />
              <Typography sx={{ ml: 2 }}>{currentChat.name}</Typography>
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
              {messages?.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </Box>
            <Box sx={{ p: 2, borderTop: "1px solid #ddd", display: "flex", flexDirection: "column" }}>
              {imagePreview && (
                <Box sx={{ mb: 2 }}>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: "100px", borderRadius: 8 }} />
                </Box>
              )}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  placeholder="Type a message"
                  sx={{ flexGrow: 1, mr: 2 }}
                  variant="outlined"
                  onKeyPress={async (e) => {
                    if (e.key === "Enter" && e.target.value) {
                      await handleCreateMessage(e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
                <input type="file" accept="image/*" onChange={handleSelectImage} hidden id="image-input" />
                <label htmlFor="image-input">
                  <IconButton component="span">
                    <AddPhotoAlternateIcon />
                  </IconButton>
                </label>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  onClick={async () => {
                    const input = document.querySelector('input[placeholder="Type a message"]');
                    if (input.value) {
                      await handleCreateMessage(input.value);
                      input.value = "";
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Send"}
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>No chat selected</Box>
        )}
      </Grid>
    </Grid>
  );
}
