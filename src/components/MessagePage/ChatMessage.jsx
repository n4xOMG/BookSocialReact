import { Box, Fade, Paper, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";

export default function ChatMessage({ message }) {
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isReqUserMessages = user?.id === message.sender.id;

  // Format timestamp nicely
  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else {
      return (
        date.toLocaleDateString([], { month: "short", day: "numeric" }) +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
  };

  return (
    <Fade in={true} timeout={300}>
      <Box
        sx={{
          display: "flex",
          justifyContent: `${!isReqUserMessages ? "flex-start" : "flex-end"}`,
          mb: 1.5,
          maxWidth: "100%",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 1.5,
            borderRadius: 2,
            maxWidth: "70%",
            bgcolor: isReqUserMessages
              ? theme.palette.mode === "light"
                ? "primary.light"
                : "primary.dark"
              : theme.palette.mode === "light"
              ? "background.paper"
              : "grey.800",
            borderTopLeftRadius: !isReqUserMessages ? 0 : 2,
            borderTopRightRadius: isReqUserMessages ? 0 : 2,
          }}
        >
          {message.imageUrl && (
            <Box
              component="img"
              sx={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: 1,
                mb: 1,
                cursor: "pointer",
              }}
              src={message.imageUrl}
              alt="Message attachment"
              onClick={() => window.open(message.imageUrl, "_blank")}
            />
          )}

          {message.content && (
            <Typography
              variant="body2"
              sx={{
                color: isReqUserMessages ? (theme.palette.mode === "light" ? "white" : "white") : "text.primary",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {message.content}
            </Typography>
          )}

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 0.5,
              textAlign: "right",
              color: isReqUserMessages ? (theme.palette.mode === "light" ? "primary.grey" : "rgba(255,255,255,0.7)") : "text.secondary",
            }}
          >
            {formatTime(message.timestamp)}
          </Typography>
        </Paper>
      </Box>
    </Fade>
  );
}
