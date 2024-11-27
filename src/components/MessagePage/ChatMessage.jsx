import { Box, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

export default function ChatMessage({ message }) {
  const { user } = useSelector((state) => state.auth);
  const isReqUserMessages = user?.id === message.sender.id;
  return (
    <Box sx={{ display: "flex", justifyContent: `${!isReqUserMessages ? "start" : "end"}`, mb: 2 }}>
      <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#191c25", maxWidth: "70%" }}>
        {message.imageUrl && <Box component="img" sx={{ width: "200px", height: "auto", borderRadius: 2, mb: 1 }} src={message.imageUrl} />}
        <Typography variant="body1" sx={{ color: "white" }}>
          {message.content}
        </Typography>
        <Typography variant="caption" gutterBottom sx={{ display: "block", color: "whitesmoke" }}>
          {message.timestamp ? new Date(message.timestamp).toLocaleString() : ""}
        </Typography>
      </Box>
    </Box>
  );
}
