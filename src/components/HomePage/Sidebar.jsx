import { Book, Bookmark, Chat, FormatQuote, Person } from "@mui/icons-material";
import { Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import ReadingHistoryCard from "./ReadingHistoryCard";

export const Sidebar = ({ readingHistory }) => (
  <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0, "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" } }}>
    <Box p={2}>
      <Typography variant="h6" fontWeight="bold">
        BookLovers
      </Typography>
    </Box>
    <List>
      {[
        { text: "Discover", icon: <Book /> },
        { text: "My Library", icon: <Person /> },
        { text: "Book Clubs", icon: <Chat /> },
        { text: "My Bookshelf", icon: <Bookmark /> },
        { text: "Quotes", icon: <FormatQuote /> },
      ].map((item, index) => (
        <ListItem button key={index}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
    <Divider />
    <ReadingHistoryCard readingHistory={readingHistory} />
  </Drawer>
);
