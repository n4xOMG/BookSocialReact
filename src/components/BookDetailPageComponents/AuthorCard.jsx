import { Avatar, Box, Button, Stack, Typography, Divider, IconButton, useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createChat } from "../../redux/chat/chat.action";
import { followAuthorAction, getUserById, unfollowAuthorAction } from "../../redux/user/user.action";
import { Email, Person } from "@mui/icons-material";

const AuthorCard = ({ author, checkAuth }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

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
      <Box sx={{ display: "flex", alignItems: "center", mb: isMobile ? 2 : 3 }}>
        <Person sx={{ mr: 1.5, color: "#9d50bb" }} />
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
          Author
        </Typography>
      </Box>

      <Divider sx={{ mb: isMobile ? 2 : 3, opacity: 0.3 }} />

      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
        <Avatar
          src={author.avatarUrl}
          alt={author.username}
          sx={{
            width: 80,
            height: 80,
            mr: 3,
            border: "3px solid",
            borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.4)" : "rgba(157, 80, 187, 0.3)"),
            boxShadow: "0 4px 16px rgba(157, 80, 187, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 6px 24px rgba(157, 80, 187, 0.5)",
            },
          }}
        />

        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between",
              mb: 1,
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: isMobile ? 1 : 0,
                background: (theme) =>
                  theme.palette.mode === "dark" ? "linear-gradient(135deg, #9d50bb, #6e48aa)" : "linear-gradient(135deg, #6e48aa, #9d50bb)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
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
                    py: 0.75,
                    borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(132, 250, 176, 0.3)" : "rgba(0, 201, 167, 0.3)"),
                    color: (theme) => (theme.palette.mode === "dark" ? "#84fab0" : "#00c9a7"),
                    fontWeight: 600,
                    background: (theme) => (theme.palette.mode === "dark" ? "rgba(132, 250, 176, 0.08)" : "rgba(0, 201, 167, 0.08)"),
                    backdropFilter: "blur(8px)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(132, 250, 176, 0.5)" : "rgba(0, 201, 167, 0.5)"),
                      background: (theme) => (theme.palette.mode === "dark" ? "rgba(132, 250, 176, 0.15)" : "rgba(0, 201, 167, 0.15)"),
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0, 201, 167, 0.2)",
                    },
                  }}
                >
                  Message
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  onClick={handleFollow}
                  sx={{
                    borderRadius: "12px",
                    px: 2,
                    py: 0.75,
                    background: bookAuthor?.followedByCurrentUser
                      ? "linear-gradient(135deg, #ff6b6b, #ee5a52)"
                      : "linear-gradient(135deg, #9d50bb, #6e48aa)",
                    color: "#fff",
                    fontWeight: 600,
                    boxShadow: bookAuthor?.followedByCurrentUser
                      ? "0 4px 12px rgba(255, 107, 107, 0.3)"
                      : "0 4px 12px rgba(157, 80, 187, 0.3)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      background: bookAuthor?.followedByCurrentUser
                        ? "linear-gradient(135deg, #ff7b7b, #ff6b6b)"
                        : "linear-gradient(135deg, #b968c7, #9d50bb)",
                      transform: "translateY(-2px)",
                      boxShadow: bookAuthor?.followedByCurrentUser
                        ? "0 6px 20px rgba(255, 107, 107, 0.4)"
                        : "0 6px 20px rgba(157, 80, 187, 0.5)",
                    },
                  }}
                >
                  {bookAuthor?.followedByCurrentUser ? "Following" : "Follow"}
                </Button>
              </Stack>
            )}
          </Box>

          <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.6, color: "text.secondary", display: isMobile ? "none" : "block" }}>
            {author.bio || "No bio available for this author."}
          </Typography>

          <Button
            variant="text"
            size="small"
            onClick={() => navigate(`/profile/${author.id}`)}
            sx={{
              mt: isMobile ? 0 : 2,
              pl: 0,
              color: (theme) => (theme.palette.mode === "dark" ? "#9d50bb" : "#6e48aa"),
              fontWeight: 600,
              "&:hover": {
                background: "transparent",
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
