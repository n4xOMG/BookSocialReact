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
        mb: 1.5,
        boxShadow: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
        borderRadius: "16px",
        background: isSelected
          ? theme.palette.mode === "dark"
            ? "rgba(157, 80, 187, 0.2)"
            : "rgba(157, 80, 187, 0.15)"
          : theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid",
        borderColor: isSelected
          ? theme.palette.mode === "dark"
            ? "rgba(157, 80, 187, 0.5)"
            : "rgba(157, 80, 187, 0.4)"
          : theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.1)",
        borderLeft: isSelected ? `4px solid #9d50bb` : "none",
        "&:hover": {
          background: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.15)" : "rgba(157, 80, 187, 0.1)",
          borderColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.4)" : "rgba(157, 80, 187, 0.3)",
          transform: "translateX(4px)",
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
              border: "2px solid",
              borderColor: isSelected
                ? theme.palette.mode === "dark"
                  ? "rgba(157, 80, 187, 0.6)"
                  : "rgba(157, 80, 187, 0.5)"
                : theme.palette.mode === "dark"
                ? "rgba(157, 80, 187, 0.3)"
                : "rgba(157, 80, 187, 0.2)",
              boxShadow: isSelected ? "0 4px 12px rgba(157, 80, 187, 0.3)" : "none",
            }}
            src={userChat.avatarUrl || "https://www.w3schools.com/howto/img_avatar.png"}
          />
        }
      />
    </Card>
  );
}
