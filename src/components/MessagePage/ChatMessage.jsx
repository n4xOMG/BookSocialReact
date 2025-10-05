import { Box, Fade, Paper, Tooltip, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { formatRelativeTime, formatExactTime } from "../../utils/formatDate";

export default function ChatMessage({ message }) {
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isReqUserMessages = user?.id === message.sender.id;

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
          <Tooltip title={formatExactTime(message.timestamp)} placement="bottom">
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 0.5,
                textAlign: "right",
                color: isReqUserMessages ? (theme.palette.mode === "light" ? "primary.grey" : "rgba(255,255,255,0.7)") : "text.secondary",
              }}
            >
              {formatRelativeTime(message.timestamp)}
            </Typography>
          </Tooltip>
        </Paper>
      </Box>
    </Fade>
  );
}
