import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createChat } from "../../redux/chat/chat.action";
import { followAuthorAction, getUserById, unfollowAuthorAction } from "../../redux/user/user.action";
const AuthorCard = ({ author, checkAuth }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const bookAuthor = useSelector((store) => store.user.user);
  useEffect(() => {
    dispatch(getUserById(author.id));
  }, [dispatch, author.id]);
  const handleFollow = checkAuth(() => {
    if (author.id === user?.id) {
      alert("Cannot self-follow!");
    }
    if (bookAuthor?.followedByCurrentUser) {
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
        {user?.id !== author.id && (
          <>
            <Button variant="outlined" color="primary" onClick={handleMessageClick}>
              Message
            </Button>
            <Button variant={bookAuthor?.followedByCurrentUser ? "contained" : "outlined"} color="primary" onClick={handleFollow}>
              {bookAuthor?.followedByCurrentUser ? "Following" : "Follow"}
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default AuthorCard;
