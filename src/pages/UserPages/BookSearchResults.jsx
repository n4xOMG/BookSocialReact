import { Alert, Box, Card, CardContent, CardMedia, Chip, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/HomePage/Header";
import Sidebar from "../../components/HomePage/Sidebar";
import { searchBookAction } from "../../redux/book/book.action";
import { getCategories } from "../../redux/category/category.action";
import { getTags } from "../../redux/tag/tag.action";

const BookSearchResults = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const { categories } = useSelector((state) => state.category);
  const { tags } = useSelector((state) => state.tag);
  const { searchResults } = useSelector((state) => state.book);

  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  // State variables for UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCategoryById = (categoryId) => {
    return categories.find((category) => categoryId === category.id);
  };

  const getTagsByIds = (tagIds) => {
    return tags.filter((tag) => tagIds.includes(tag.id));
  };
  useEffect(() => {
    setLoading(true);
    try {
      dispatch(getCategories());
      dispatch(getTags());
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        await dispatch(searchBookAction(queryParams));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [location.search]);

  return (
    <Box sx={{ display: "flex", height: "100vh", overscrollBehavior: "contain" }}>
      <Sidebar />

      <Box sx={{ width: "100%" }}>
        <Header />
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", marginY: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ marginY: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && searchResults.length === 0 && !error && (
          <Alert severity="info" sx={{ marginY: 2 }}>
            No books found matching your criteria.
          </Alert>
        )}

        <Grid container spacing={4} padding={3}>
          {searchResults?.map((book) => (
            <Grid item key={book.id} xs={12} sm={6} md={4}>
              <Card
                onClick={() => navigate(`/books/${book.id}`)}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 3,
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                {book.bookCover && <CardMedia component="img" sx={{ height: 200 }} image={book.bookCover} alt={book.title} />}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Author: {book.authorName || "Unknown"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {getCategoryById(book.categoryId).name || "N/A"}
                  </Typography>
                  <Box sx={{ marginTop: 1 }}>
                    {book.tagIds && book.tagIds.length > 0 && (
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {getTagsByIds(book.tagIds).map((tag) => (
                          <Chip key={tag.id} label={tag.name} size="small" color="primary" />
                        ))}
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default BookSearchResults;
