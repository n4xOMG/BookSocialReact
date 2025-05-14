import { Avatar, Box, Button, Stack, Typography, Divider, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createChat } from "../../redux/chat/chat.action";
import { followAuthorAction, getUserById, unfollowAuthorAction } from "../../redux/user/user.action";
import { Email, Person } from "@mui/icons-material";

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
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Person sx={{ mr: 1.5 }} />
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Author
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
        <Avatar
          src={author.avatarUrl}
          alt={author.username}
          sx={{
            width: 80,
            height: 80,
            mr: 3,
            border: "2px solid",
            borderColor: "primary.main",
          }}
        />

        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {author.username}
            </Typography>

            {user?.id !== author.id && (
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Email />}
                  onClick={handleMessageClick}
                  sx={{
                    borderRadius: 1,
                    px: 2,
                    py: 0.75,
                  }}
                >
                  Message
                </Button>

                <Button
                  variant={bookAuthor?.followedByCurrentUser ? "contained" : "outlined"}
                  size="small"
                  onClick={handleFollow}
                  sx={{
                    borderRadius: 1,
                    px: 2,
                    py: 0.75,
                  }}
                >
                  {bookAuthor?.followedByCurrentUser ? "Following" : "Follow"}
                </Button>
              </Stack>
            )}
          </Box>

          <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.6, color: "text.secondary" }}>
            {author.bio || "No bio available for this author."}
          </Typography>

          <Button variant="text" size="small" onClick={() => navigate(`/profile/${author.id}`)} sx={{ mt: 2, pl: 0 }}>
            View Full Profile
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthorCard;
