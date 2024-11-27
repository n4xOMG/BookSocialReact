import { Book, Bookmark, Chat, Money, Person } from "@mui/icons-material";
import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getReadingProgressByUser } from "../../redux/user/user.action";
import ReadingHistoryCard from "./ReadingHistoryCard";

export const Sidebar = () => {
  const { readingProgresses = [] } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
          { text: "Credit Packages", icon: <Money />, link: "/credit-packages" },
        ]
      : []),
    { text: "Book Clubs", icon: <Chat />, link: "/book-clubs" },
  ];
  useEffect(() => {
    try {
      dispatch(getReadingProgressByUser());
    } catch (error) {
      console.log("Error trying to get reading progress: ", error);
    }
  }, [dispatch]);
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
      <ReadingHistoryCard readingProgresses={readingProgresses} />
    </Drawer>
  );
};

export default Sidebar;
