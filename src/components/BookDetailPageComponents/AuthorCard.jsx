import { Avatar, Box, Button, Stack, Typography, Divider, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createChat } from "../../redux/chat/chat.action";
import { followAuthorAction, getUserById, unfollowAuthorAction } from "../../redux/user/user.action";
import { Email, Person } from "@mui/icons-material";

const AuthorCard = ({ author, checkAuth }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      const chatId = await dispatch(createChat(author.id));
      navigate(`/chats/${chatId}`);
    } catch (error) {
      console.error("Failed to create or retrieve chat:", error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Person sx={{ mr: 1.5, color: theme.palette.primary.main }} />
        <Typography
          variant="h5"
          className="font-serif"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          Author
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: "flex", alignItems: "flex-start", flexDirection: isMobile ? "column" : "row", gap: 3 }}>
        <Avatar
          src={author.avatarUrl}
          alt={author.username}
          sx={{
            width: 80,
            height: 80,
            border: `3px solid ${theme.palette.primary.main}40`,
            boxShadow: theme.shadows[3],
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: theme.shadows[6],
            },
          }}
        />

        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between",
              mb: 1,
              flexDirection: isMobile ? "column" : "row",
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
              }}
            >
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
                    borderRadius: "12px",
                    px: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Message
                </Button>

                <Button
                  variant={bookAuthor?.followedByCurrentUser ? "contained" : "outlined"}
                  color={bookAuthor?.followedByCurrentUser ? "error" : "primary"}
                  size="small"
                  onClick={handleFollow}
                  sx={{
                    borderRadius: "12px",
                    px: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {bookAuthor?.followedByCurrentUser ? "Unfollow" : "Follow"}
                </Button>
              </Stack>
            )}
          </Box>

          <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.6, color: theme.palette.text.secondary }}>
            {author.bio || "No bio available for this author."}
          </Typography>

          <Button
            variant="text"
            size="small"
            onClick={() => navigate(`/profile/${author.id}`)}
            sx={{
              mt: 2,
              pl: 0,
              color: theme.palette.primary.main,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                bgcolor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            View Full Profile
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthorCard;
