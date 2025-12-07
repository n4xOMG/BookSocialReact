import { Box, Fade, Paper, Tooltip, Typography, useTheme, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { formatRelativeTime, formatExactTime } from "../../utils/formatDate";
import { useState } from "react";

const ImageAttachment = ({ image }) => {
  const theme = useTheme();
  const imageUrl = typeof image === "object" ? image.url : image;
  const isMild = typeof image === "object" ? (image.isMild || image.mild) : false;
  const [isBlurred, setIsBlurred] = useState(isMild);

  return (
    <Box sx={{ position: "relative", mb: 1 }}>
      <Box
        component="img"
        sx={{
          width: "100%",
          maxHeight: "200px",
          objectFit: "cover",
          borderRadius: "12px",
          cursor: isBlurred ? "default" : "pointer",
          border: "2px solid",
          borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
          transition: "transform 0.2s ease",
          filter: isBlurred ? "blur(20px)" : "none",
          "&:hover": {
            transform: isBlurred ? "none" : "scale(1.02)",
          },
        }}
        src={imageUrl}
        alt="Message attachment"
        onClick={() => !isBlurred && window.open(imageUrl, "_blank")}
      />
      {isBlurred && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(0,0,0,0.3)",
            zIndex: 1,
            borderRadius: "12px",
          }}
        >
          <Typography variant="body2" sx={{ color: "white", mb: 1, fontWeight: "bold" }}>
            Mild Content
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setIsBlurred(false);
            }}
            sx={{
              bgcolor: "rgba(0,0,0,0.6)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
            }}
          >
            Show
          </Button>
        </Box>
      )}
    </Box>
  );
};

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
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: "16px",
            maxWidth: "70%",
            background: isReqUserMessages
              ? "linear-gradient(135deg, rgba(157, 80, 187, 0.8), rgba(110, 72, 170, 0.8))"
              : theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid",
            borderColor: isReqUserMessages
              ? "rgba(157, 80, 187, 0.4)"
              : theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.15)"
              : "rgba(0, 0, 0, 0.1)",
            boxShadow: isReqUserMessages ? "0 4px 16px rgba(157, 80, 187, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
            borderTopLeftRadius: !isReqUserMessages ? 0 : "16px",
            borderTopRightRadius: isReqUserMessages ? 0 : "16px",
          }}
        >
          {message.image && (
            <ImageAttachment
              image={message.image}
            />
          )}

          {message.content && (
            <Typography
              variant="body2"
              sx={{
                color: isReqUserMessages ? "white" : "text.primary",
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
                color: isReqUserMessages ? "rgba(255,255,255,0.7)" : "text.secondary",
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
