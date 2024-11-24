import AddIcon from "@mui/icons-material/Add";
import { Alert, Box, Button, CircularProgress, Grid, Snackbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getBooksByAuthorAction } from "../../redux/book/book.action";
import { getCategories } from "../../redux/category/category.action";
import { getTags } from "../../redux/tag/tag.action";
import UserBookCard from "../../components/UserBooks/UserBookCard";
import Sidebar from "../../components/HomePage/Sidebar";

const UserBooks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { booksByAuthor, loading, error } = useSelector((state) => state.book);
  const { user } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.category);
  const { tags } = useSelector((state) => state.tag);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(getBooksByAuthorAction(user.id));
    dispatch(getCategories());
    dispatch(getTags());
  }, [dispatch, user.id]);

  const handleAddBookClick = () => {
    navigate("/upload-book");
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  const getCategoryById = (categoryId) => {
    return categories.find((category) => categoryId === category.id);
  };
  const getTagsByIds = (tagIds) => {
    return tags.filter((tag) => tagIds.includes(tag.id));
  };
  return (
    <Box sx={{ display: "flex", height: "100vh", overscrollBehavior: "contain" }}>
      <Sidebar />
      <Box sx={{ p: { xs: 2, md: 4 }, width: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: { xs: 2, md: 4 },
          }}
        >
          <Typography variant="h4" gutterBottom>
            Manage Your Books
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddBookClick} color="primary">
            Add New Book
          </Button>
        </Box>

        {/* Books Grid */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        ) : booksByAuthor.length === 0 ? (
          <Typography variant="h6">You have no books. Add one to get started!</Typography>
        ) : (
          <Grid container spacing={4}>
            {booksByAuthor.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <UserBookCard book={{ ...book, category: getCategoryById(book.categoryId), tags: getTagsByIds(book.tagIds) }} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Snackbar for Feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default UserBooks;
