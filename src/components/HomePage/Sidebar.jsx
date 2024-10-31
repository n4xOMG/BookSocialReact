import { Book, Bookmark, Chat, FormatQuote, Person } from "@mui/icons-material";
import { Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import ReadingHistoryCard from "./ReadingHistoryCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const Sidebar = () => {
  const [readingHistory, setReadingHistory] = useState([
    { id: 1, title: "1984", author: "George Orwell", lastRead: "2 days ago" },
    { id: 2, title: "The Catcher in the Rye", author: "J.D. Salinger", lastRead: "1 week ago" },
    { id: 3, title: "Pride and Prejudice", author: "Jane Austen", lastRead: "2 weeks ago" },
    { id: 4, title: "The Hobbit", author: "J.R.R. Tolkien", lastRead: "1 month ago" },
  ]);
  const navigate = useNavigate();
  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0, "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" } }}>
      <Box p={2}>
        <Typography variant="h6" fontWeight="bold">
          BookLovers
        </Typography>
      </Box>
      <List>
        {[
          { text: "Home", icon: <Book />, link: "/" },
          { text: "My Stories", icon: <Person />, link: "/stories" },
          { text: "Book Clubs", icon: <Chat />, link: "/book-clubs" },
          { text: "My Bookshelf", icon: <Bookmark />, link: "/bookshelf" },
        ].map((item, index) => (
          <ListItem onClick={() => navigate(`${item.link}`)} sx={{ cursor: "pointer" }} button key={index}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <ReadingHistoryCard readingHistory={readingHistory} />
    </Drawer>
  );
};
