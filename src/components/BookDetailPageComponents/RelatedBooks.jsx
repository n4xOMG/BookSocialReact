import React, { useEffect } from "react";
import { Box, Grid, Typography, Card, CardMedia, CardContent, CardActions, Button, Stack, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../redux/category/category.action";
import { getTags } from "../../redux/tag/tag.action";
import { useDispatch } from "react-redux";

const RelatedBooks = ({ relatedBooks, loading, categories, tags }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categoryMap = categories?.reduce((acc, category) => {
    acc[category.id] = category.name;
    return acc;
  }, {});

  const tagMap = tags?.reduce((acc, tag) => {
    acc[tag.id] = tag.name;
    return acc;
  }, {});
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
    if (tags.length === 0) {
      dispatch(getTags());
    }
  }, [dispatch, categories.length, tags.length]);
  if (loading) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6">Loading related books...</Typography>
      </Box>
    );
  }

  if (!relatedBooks || relatedBooks.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" gutterBottom>
        Related Books
      </Typography>
      <Grid container spacing={3}>
        {relatedBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardMedia component="img" image={book.bookCover} alt={`Cover of ${book.title}`} sx={{ height: 200 }} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  by {book.authorName}
                </Typography>
                {/* Display Category */}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Category: {categoryMap[book.categoryId] || "N/A"}
                </Typography>
                {/* Display Tags */}
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                  {book.tagIds.map((tagId) => (
                    <Chip key={tagId} label={tagMap[tagId] || "Unknown"} size="small" />
                  ))}
                </Stack>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/books/${book.id}`)}>
                  Read
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RelatedBooks;
