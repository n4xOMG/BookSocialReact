import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Avatar, Box, Button, CircularProgress, Grid, IconButton, TextField, Typography, useTheme } from "@mui/material";
import { Stomp } from "@stomp/stompjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "../../api/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ChatMessage from "../../components/MessagePage/ChatMessage";
import SearchUser from "../../components/MessagePage/SearchUser";
import UserChatCard from "../../components/MessagePage/UserChatCard";
import { createMessage, fetchChatMessages, fetchUserChats } from "../../redux/chat/chat.action";
import { RECEIVE_MESSAGE } from "../../redux/chat/chat.actionType";
import { UploadToServer } from "../../utils/uploadToServer";

export default function MessagesPage() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { chatId } = useParams();
  const { chats } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [currentChat, setCurrentChat] = useState();
  const rawMessages = useSelector((state) => (currentChat ? state.chat.messages[currentChat.id] || [] : []));
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isFetchingChats, setIsFetchingChats] = useState(true);
  const messagesContainerRef = useRef(null);
  const socketRef = useRef(null);
  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);
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


  useEffect(() => {
    if (chatId && chats.length > 0 && !currentChat) {
      const chatFromUrl = chats.find((chat) => chat.id === chatId);
      if (chatFromUrl) {
        setCurrentChat(chatFromUrl);
      }
    }
  }, [chatId, chats, currentChat]);


  const otherUser = useMemo(() => {
    if (!currentChat || !user) return null;
    return currentChat.userOne.id === user.id ? currentChat.userTwo : currentChat.userOne;
  }, [currentChat, user]);

  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCreateMessage = async (value) => {
    if (!currentChat || isSending) return;
    const trimmedValue = value.trim();
    if (!trimmedValue && !selectedImage) return;

    setIsSending(true);
    try {
      let imageObj = null;
      if (selectedImage) {
        const uploadResult = await UploadToServer(selectedImage, user.username, `chatimages_${currentChat.id}_${Date.now()}`);
        imageObj = {
          url: uploadResult.url,
          isMild: uploadResult.safety?.level === "MILD"
        };
      }
      const message = {
        chat: { id: currentChat.id },
        chatId: currentChat.id,
        sender: { id: user.id },
        receiver: {
          id: currentChat.userOne.id === user.id ? currentChat.userTwo.id : currentChat.userOne.id,
        },
        content: trimmedValue,
        image: imageObj,
      };
      await dispatch(createMessage({ message, sendMessageToServer }));
      setSelectedImage(null);
      setImagePreview(null);
      setMessageText("");
    } finally {
      setIsSending(false);
    }
  };


  const setupStompClient = () => {
    try {
      setIsConnecting(true);
      if (socketRef.current) {
        socketRef.current.close();
      }

      const socket = new SockJS(`${API_BASE_URL}/ws`);
      socketRef.current = socket;
      const stomp = Stomp.over(socket);
      stompClientRef.current = stomp;
      stomp.connect({}, onConnect, onErr);

      return () => {
        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
        }
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
        if (stompClientRef.current) {
          stompClientRef.current.disconnect();
        }
        setIsConnected(false);
      };
    } catch (error) {

      attemptReconnect();
    }
  };

  useEffect(() => {
    return setupStompClient();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !isConnected) {
        if (stompClientRef.current && !stompClientRef.current.connected) {
          setupStompClient();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isConnected]);

  const attemptReconnect = () => {
    if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttemptsRef.current += 1;

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }

      reconnectTimerRef.current = setTimeout(() => {
        setupStompClient();
      }, RECONNECT_INTERVAL);
    } else {
      setIsConnecting(false);
    }
  };

  const onConnect = () => {
    setIsConnecting(false);
    setIsConnected(true);
    reconnectAttemptsRef.current = 0;
    subscribeToChat();
  };

  const onErr = () => {
    setIsConnecting(false);
    setIsConnected(false);
    attemptReconnect();
  };

  const subscribeToChat = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    if (stompClientRef.current && stompClientRef.current.connected && user && currentChat) {
      try {
        subscriptionRef.current = stompClientRef.current.subscribe(`/group/${currentChat.id}/private`, onMessageReceived);
      } catch (error) {
        if (error.message.includes("no underlying")) {
          attemptReconnect();
        }
      }
    }
  };

  const sendMessageToServer = (newMessage) => {
    if (!stompClientRef.current || !newMessage || !currentChat) return;

    try {
      if (stompClientRef.current.connected) {
        stompClientRef.current.send(`/app/chat/${currentChat?.id.toString()}`, {}, JSON.stringify(newMessage));
      } else {
        setupStompClient();
      }
    } catch (error) {
      if (error.message.includes("no underlying")) {
        attemptReconnect();
      }
    }
  };

  const onMessageReceived = (payload) => {
    const receivedMessage = JSON.parse(payload.body);
    dispatch({ type: RECEIVE_MESSAGE, payload: receivedMessage });
  };

  useEffect(() => {
    if (stompClientRef.current && user && currentChat && isConnected) {
      subscribeToChat();
    }
  }, [user, currentChat, isConnected]);

  useEffect(() => {
    if (currentChat) {
      dispatch(fetchChatMessages(currentChat.id));
    }
  }, [currentChat, dispatch]);

  const messages = useMemo(() => {
    if (!rawMessages) return [];
    return [...rawMessages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [rawMessages]);

  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 0) {
      messagesContainerRef.current.scrollTop = 0;
    }
  }, [currentChat]);

  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 0) {
      const timeoutId = setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = 0;
        }
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [messages.length]);
  if (isConnecting || isFetchingChats) {
    return <LoadingSpinner />;
  }

  return (
    <Box
      sx={{
        flex: 1,
        width: "100%",
        height: "100%",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0f0f1c 0%, #1a1a2e 100%)"
            : "linear-gradient(135deg, #f8f7f4 0%, #e8e6e3 100%)",
        p: 3,
      }}
    >
      <Grid
        container
        sx={{
          height: "100%",
          overflow: "hidden",
          borderRadius: "24px",
          background: theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.6)" : "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.2)" : "rgba(157, 80, 187, 0.15)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Grid
          item
          xs={3}
          sx={{
            px: 3,
            borderRight: "1px solid",
            borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
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
                    <UserChatCard chat={chat} isSelected={currentChat?.id === chat.id} />
                  </div>
                ))}
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={9} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {currentChat ? (
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderBottom: "1px solid",
                  borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                  background: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.1)" : "rgba(157, 80, 187, 0.05)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Avatar
                  src={otherUser?.avatarUrl}
                  sx={{
                    width: 48,
                    height: 48,
                    border: "2px solid",
                    borderColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.4)" : "rgba(157, 80, 187, 0.3)",
                    boxShadow: "0 4px 12px rgba(157, 80, 187, 0.3)",
                  }}
                />
                <Typography
                  sx={{
                    ml: 2,
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: theme.palette.mode === "dark" ? "#fff" : "#1a1a2e",
                  }}
                >
                  {otherUser?.username}
                </Typography>
              </Box>
              <Box
                ref={messagesContainerRef}
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  p: 2,
                  display: "flex",
                  flexDirection: "column-reverse",
                }}
              >

                {[...messages].reverse().map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </Box>
              <Box
                sx={{
                  p: 2,
                  borderTop: "1px solid",
                  borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  background: theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.4)" : "rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {imagePreview && (
                  <Box
                    sx={{
                      mb: 2,
                      p: 1,
                      borderRadius: "12px",
                      background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                      border: "1px solid",
                      borderColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.3)" : "rgba(157, 80, 187, 0.2)",
                    }}
                  >
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: "100px", borderRadius: 8 }} />
                  </Box>
                )}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    placeholder="Type a message"
                    sx={{
                      flexGrow: 1,
                      mr: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "16px",
                        background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(8px)",
                      },
                    }}
                    variant="outlined"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        await handleCreateMessage(messageText);
                      }
                    }}
                  />
                  <input type="file" accept="image/*" onChange={handleSelectImage} hidden id="image-input" />
                  <label htmlFor="image-input">
                    <IconButton
                      component="span"
                      sx={{
                        background: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.2)" : "rgba(157, 80, 187, 0.1)",
                        backdropFilter: "blur(8px)",
                        mr: 1,
                        "&:hover": {
                          background: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.3)" : "rgba(157, 80, 187, 0.2)",
                        },
                      }}
                    >
                      <AddPhotoAlternateIcon sx={{ color: "#9d50bb" }} />
                    </IconButton>
                  </label>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isSending}
                    onClick={async () => {
                      await handleCreateMessage(messageText);
                    }}
                    sx={{
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                      color: "#fff",
                      fontWeight: 700,
                      px: 3,
                      textTransform: "none",
                      boxShadow: "0 4px 16px rgba(157, 80, 187, 0.3)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #b968c7, #9d50bb)",
                        boxShadow: "0 6px 24px rgba(157, 80, 187, 0.5)",
                        transform: "translateY(-2px)",
                      },
                      "&:disabled": {
                        background: "rgba(157, 80, 187, 0.3)",
                      },
                    }}
                  >
                    {isSending ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Send"}
                  </Button>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                No chat selected
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                }}
              >
                Select a conversation to start messaging
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
