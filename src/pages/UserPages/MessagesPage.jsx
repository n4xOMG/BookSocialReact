import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import WestIcon from "@mui/icons-material/West";
import { Avatar, Box, Button, CircularProgress, Grid, IconButton, TextField, Typography } from "@mui/material";
import { Stomp } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "../../api/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ChatMessage from "../../components/MessagePage/ChatMessage";
import SearchUser from "../../components/MessagePage/SearchUser";
import UserChatCard from "../../components/MessagePage/UserChatCard";
import { createMessage, fetchChatMessages, fetchUserChats } from "../../redux/chat/chat.action";
import { RECEIVE_MESSAGE } from "../../redux/chat/chat.actionType";
import UploadToCloudinary from "../../utils/uploadToCloudinary";

export default function MessagesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chats } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [currentChat, setCurrentChat] = useState();
  const messages = useSelector((state) => (currentChat ? state.chat.messages[currentChat.id] || [] : []));
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isFetchingChats, setIsFetchingChats] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const reconnectAttemptsRef = useRef(0);
  const RECONNECT_INTERVAL = 3000;

  useEffect(() => {
    const fetchChats = async () => {
      await dispatch(fetchUserChats());
      setIsFetchingChats(false);
    };
    fetchChats();
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
      receiver: { id: currentChat.userOne.id === user.id ? user.id : currentChat.userTwo.id },
      content: value,
      imageUrl: imgUrl,
    };
    dispatch(createMessage({ message, sendMessageToServer }));
    setSelectedImage(null);
    setImagePreview(null);
    setLoading(false);
    setIsSending(false);
  };

  // Setup WebSocket connection
  const setupStompClient = () => {
    try {
      setIsConnecting(true);
      if (socketRef.current) {
        socketRef.current.close();
      }

      const socket = new SockJS(`${API_BASE_URL}/ws`);
      socketRef.current = socket;
      const stomp = Stomp.over(socket);

      setStompClient(stomp);
      stomp.connect({}, onConnect, onErr);

      return () => {
        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
        }
        if (stomp) {
          stomp.disconnect();
        }
        setIsConnected(false);
      };
    } catch (error) {
      console.error("Error setting up STOMP client:", error);
      attemptReconnect();
    }
  };

  useEffect(() => {
    return setupStompClient();
  }, []);

  // Handle visibility change to reconnect when tab becomes active again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !isConnected) {
        console.log("Page became visible, checking connection...");
        if (stompClient && !stompClient.connected) {
          setupStompClient();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [stompClient, isConnected]);

  const attemptReconnect = () => {
    if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttemptsRef.current += 1;
      console.log(`Attempting reconnect ${reconnectAttemptsRef.current} of ${MAX_RECONNECT_ATTEMPTS} in ${RECONNECT_INTERVAL}ms`);

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }

      reconnectTimerRef.current = setTimeout(() => {
        setupStompClient();
      }, RECONNECT_INTERVAL);
    } else {
      console.error("Max reconnect attempts reached");
      setIsConnecting(false);
    }
  };

  const onConnect = () => {
    console.log("Connected to WebSocket");
    setIsConnecting(false);
    setIsConnected(true);
    reconnectAttemptsRef.current = 0;
    subscribeToChat();
  };

  const onErr = (err) => {
    console.log("Websocket error: ", err);
    setIsConnecting(false);
    setIsConnected(false);
    attemptReconnect();
  };

  const subscribeToChat = () => {
    if (stompClient && stompClient.connected && user && currentChat) {
      try {
        console.log(`Subscribing to group: /group/${currentChat.id}/private`);
        stompClient.subscribe(`/group/${currentChat.id}/private`, onMessageReceived);
      } catch (error) {
        console.error("Error subscribing to chat:", error);
        // If this fails, we might need to reconnect
        if (error.message.includes("no underlying")) {
          attemptReconnect();
        }
      }
    }
  };

  const sendMessageToServer = (newMessage) => {
    if (!stompClient || !newMessage || !currentChat) return;

    try {
      if (stompClient.connected) {
        stompClient.send(`/app/chat/${currentChat?.id.toString()}`, {}, JSON.stringify(newMessage));
      } else {
        console.error("STOMP client not connected, attempting to reconnect");
        setupStompClient();
        // Could queue message to be sent after reconnection if needed
      }
    } catch (error) {
      console.error("Error sending message:", error);
      if (error.message.includes("no underlying")) {
        attemptReconnect();
      }
    }
  };

  const onMessageReceived = (payload) => {
    console.log("Message received from WebSocket:", payload.body);
    const receivedMessage = JSON.parse(payload.body);
    dispatch({ type: RECEIVE_MESSAGE, payload: receivedMessage });
  };

  useEffect(() => {
    if (stompClient && user && currentChat && isConnected) {
      subscribeToChat();
    }
  }, [stompClient, user, currentChat, isConnected]);

  useEffect(() => {
    if (currentChat) {
      dispatch(fetchChatMessages(currentChat.id));
    }
  }, [currentChat, dispatch]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Show LoadingSpinner while connecting or fetching chats
  if (isConnecting || isFetchingChats) {
    return <LoadingSpinner />;
  }

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
              <Avatar src={currentChat.userOne.id === user.id ? user.avatarUrl : currentChat.userTwo.avatarUrl} />
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
