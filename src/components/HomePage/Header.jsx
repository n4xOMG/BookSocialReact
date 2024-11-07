import { Inbox, Message, Notifications, Search, Upload } from "@mui/icons-material";
import { AppBar, Avatar, Badge, Box, IconButton, InputBase, Stack, Toolbar } from "@mui/material";
import SearchBar from "./SearchBar";
import MessageMenu from "./Header/MessageMenu";
import { useState } from "react";
import NotificationMenu from "./Header/NotificationMenu";
import ProfileMenu from "./Header/ProfileMenu";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, sender: "Alice", content: "Have you read the new Stephen King?", time: "10:30 AM" },
    { id: 2, sender: "Bob", content: "What did you think of the ending of 1984?", time: "Yesterday" },
    { id: 3, sender: "Carol", content: "Can you recommend a good sci-fi novel?", time: "2 days ago" },
  ]);
  const [notifications, setNotifications] = useState([
    { id: 1, content: "Jane Doe liked your review of 'Pride and Prejudice'", time: "2 hours ago" },
    { id: 2, content: "New comment on your 'The Catcher in the Rye' post", time: "5 hours ago" },
    { id: 3, content: "Book club meeting reminder: 'Dune' discussion tonight", time: "1 day ago" },
  ]);

  return (
    <AppBar position="sticky" color="default">
      <Toolbar>
        <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
          <SearchBar />
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={() => navigate("/upload-book")}>
            <Upload />
          </IconButton>
          <MessageMenu messages={messages} />
          <NotificationMenu notifications={notifications} />
          <ProfileMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
