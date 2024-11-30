import React, { useEffect } from "react";
import { Box, Typography, Avatar, Button, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { followAuthorAction, getUserById, unfollowAuthorAction } from "../../redux/user/user.action";
import { isTokenExpired } from "../../utils/useAuthCheck";
import { useNavigate } from "react-router-dom";
import { createChat } from "../../redux/chat/chat.action";
const AuthorCard = ({ author, checkAuth }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);
  const jwt = isTokenExpired(localStorage.getItem("jwt")) ? null : localStorage.getItem("jwt");
  const handleFollow = checkAuth(() => {
    if (user?.followedByCurrentUser) {
      dispatch(unfollowAuthorAction(author.id));
    } else {
      dispatch(followAuthorAction(author.id));
    }
  });
  const handleMessageClick = async () => {
    try {
      // Dispatch createChat action and get the chatId
      const chatId = await dispatch(createChat(author.id));
      // Navigate to the chat messages page
      navigate(`/chats/${chatId}`);
    } catch (error) {
      console.error("Failed to create or retrieve chat:", error);
    }
  };
  useEffect(() => {
    dispatch(getUserById(jwt, author.id));
  }, [dispatch]);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        border: "1px solid",
        borderColor: "grey.300",
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: "white",
        mt: 4,
      }}
    >
      <Avatar src={author.avatarUrl} alt={author.username} sx={{ width: 64, height: 64, mr: 2 }} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {author.username}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {author.bio}
        </Typography>
      </Box>
      <Stack direction="column" spacing={1}>
        <Button variant="outlined" color="primary" onClick={handleMessageClick}>
          Message
        </Button>
        <Button variant={user?.followedByCurrentUser ? "contained" : "outlined"} color="primary" onClick={handleFollow}>
          {user?.followedByCurrentUser ? "Following" : "Follow"}
        </Button>
      </Stack>
    </Box>
  );
};

export default AuthorCard;
