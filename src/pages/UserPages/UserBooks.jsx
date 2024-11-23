import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getBooksByAuthorAction } from "../../redux/book/book.action";
import Sidebar from "../../components/HomePage/Sidebar";

export default function UserBooks() {
  const dispatch = useDispatch();
  const { booksByAuthor, loading, error } = useSelector((state) => state.book);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      dispatch(getBooksByAuthorAction(user.id));
    } else {
      navigate("/sign-in");
    }
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Sidebar />
      <Typography variant="h5" gutterBottom>
        Your Books
      </Typography>
      <List>
        {booksByAuthor.map((book) => (
          <ListItem key={book.id} divider>
            <ListItemText primary={book.title} secondary={`Views: ${book.views} | Chapters: ${book.chapters}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
