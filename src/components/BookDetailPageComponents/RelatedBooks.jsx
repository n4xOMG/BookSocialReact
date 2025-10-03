import { MenuBook } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Grid, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../redux/category/category.action";
import { getTags } from "../../redux/tag/tag.action";

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
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Related Books You Might Enjoy
      </Typography>

      <Grid container spacing={3}>
        {relatedBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box sx={{ position: "relative", paddingTop: "130%" }}>
                <CardMedia
                  component="img"
                  image={book.bookCover}
                  alt={`Cover of ${book.title}`}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography variant="h6" component="div" noWrap title={book.title}>
                  {book.title}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 2 }}>
                  <Avatar sx={{ width: 24, height: 24, mr: 1 }} alt={book.authorName}>
                    {book.authorName.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {book.authorName}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {categoryMap[book.categoryId] || "N/A"}
                </Typography>

                <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: "wrap", gap: 0.5 }}>
                  {book.tagIds.slice(0, 3).map((tagId) => (
                    <Chip key={tagId} label={tagMap[tagId] || "Unknown"} size="small" sx={{ height: 24, fontSize: "0.7rem" }} />
                  ))}
                  {book.tagIds.length > 3 && (
                    <Chip label={`+${book.tagIds.length - 3}`} size="small" sx={{ height: 24, fontSize: "0.7rem" }} />
                  )}
                </Stack>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="small"
                  onClick={() => navigate(`/books/${book.id}`)}
                  startIcon={<MenuBook />}
                  sx={{ borderRadius: 1 }}
                >
                  Read Now
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
