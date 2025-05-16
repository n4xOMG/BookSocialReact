import { MoreHorizRounded } from "@mui/icons-material";
import { Avatar, Box, Card, CardHeader, IconButton, useTheme } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

export default function UserChatCard({ chat, isSelected }) {
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const userChat = chat.userOne.id === user.id ? chat.userTwo : chat.userOne;

  return (
    <Card
      sx={{
        mb: 1,
        boxShadow: isSelected ? 3 : 1,
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        bgcolor: isSelected ? (theme.palette.mode === "light" ? "primary.light" : "primary.dark") : theme.palette.background.paper,
        borderLeft: isSelected ? `4px solid ${theme.palette.primary.main}` : "none",
        "&:hover": {
          bgcolor:
            theme.palette.mode === "light"
              ? isSelected
                ? "primary.light"
                : "rgba(0, 0, 0, 0.04)"
              : isSelected
              ? "primary.dark"
              : "rgba(255, 255, 255, 0.08)",
        },
      }}
    >
      <CardHeader
        action={
          <IconButton size="small">
            <MoreHorizRounded fontSize="small" />
          </IconButton>
        }
        title={userChat.username}
        subheader={userChat.fullname}
        titleTypographyProps={{
          variant: "subtitle2",
          fontWeight: "medium",
          color: isSelected ? (theme.palette.mode === "light" ? "primary.dark" : "white") : "text.primary",
        }}
        subheaderTypographyProps={{
          variant: "caption",
          color: isSelected ? (theme.palette.mode === "light" ? "primary.dark" : "white") : "text.secondary",
          noWrap: true,
        }}
        avatar={
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: theme.palette.mode === "light" ? "#e3f2fd" : "#1a237e",
              color: theme.palette.mode === "light" ? "primary.main" : "white",
            }}
            src={userChat.avatarUrl || "https://www.w3schools.com/howto/img_avatar.png"}
          />
        }
      />
    </Card>
  );
}
