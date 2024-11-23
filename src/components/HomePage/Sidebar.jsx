import { Book, Bookmark, Chat, Person } from "@mui/icons-material";
import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import ReadingHistoryCard from "./ReadingHistoryCard";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

export const Sidebar = () => {
  const [readingHistory] = useState([
    { id: 1, title: "1984", author: "George Orwell", lastRead: "2 days ago" },
    { id: 2, title: "The Catcher in the Rye", author: "J.D. Salinger", lastRead: "1 week ago" },
    { id: 3, title: "Pride and Prejudice", author: "Jane Austen", lastRead: "2 weeks ago" },
    { id: 4, title: "The Hobbit", author: "J.R.R. Tolkien", lastRead: "1 month ago" },
  ]);

  const navigate = useNavigate();
  const location = useLocation();

  // Access authentication state from Redux store
  const { user } = useSelector((state) => state.auth);

  // Define menu items, conditionally including "My Stories" and "Library" if logged in
  const menuItems = [
    { text: "Home", icon: <Book />, link: "/" },
    ...(user
      ? [
          { text: "My Stories", icon: <Person />, link: "/stories" },
          { text: "Library", icon: <Bookmark />, link: "/library" },
        ]
      : []),
    { text: "Book Clubs", icon: <Chat />, link: "/book-clubs" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
      }}
    >
      {/* Sidebar Header */}
      <Box p={2}>
        <Typography variant="h6" fontWeight="bold">
          BookLovers
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <List>
        {menuItems.map((item) => (
          <ListItemButton key={item.text} onClick={() => navigate(item.link)} selected={location.pathname === item.link}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      {/* Reading History Section */}
      <ReadingHistoryCard readingHistory={readingHistory} />
    </Drawer>
  );
};

export default Sidebar;
