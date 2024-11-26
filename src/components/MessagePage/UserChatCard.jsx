import { MoreHorizRounded } from "@mui/icons-material";
import { Avatar, Box, Card, CardHeader, IconButton } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

export default function UserChatCard({ chat }) {
  const { user } = useSelector((state) => state.auth);
  const userChat = chat.userOne === user.id ? chat.userTwo : chat.userOne;
  return (
    <Box>
      <Card sx={{ mb: 2, boxShadow: 3, cursor: "pointer" }}>
        <CardHeader
          action={
            <IconButton>
              <MoreHorizRounded />
            </IconButton>
          }
          title={userChat.username}
          subheader={userChat.fullname}
          avatar={
            <Avatar
              sx={{ width: 56, height: 56, bgcolor: "#191c29", color: "rgb(88,199,250)" }}
              src={userChat.avatarUrl || "https://www.w3schools.com/howto/img_avatar.png"}
            />
          }
        />
      </Card>
    </Box>
  );
}
