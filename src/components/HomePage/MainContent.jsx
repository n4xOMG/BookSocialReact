import { MenuBook, Recommend, TrendingUp } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, Grid, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOptimizedImageUrl } from "../../utils/optimizeImages";
export const MainContent = ({ featuredBooks, trendingBooks }) => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState("trending");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ height: "100%", backgroundColor: "background.default" }}>
      <Container sx={{ py: 8 }}>
        {/* Header Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: "bold", letterSpacing: "tight" }}>
            Discover Your Next Favorite Book
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "1.125rem" }}>
            Explore our curated collection of books across various genres.
          </Typography>
        </Box>

        {/* Editor's Choices Section */}
        <Box sx={{ mb: 12 }}>
          <Typography variant="h4" sx={{ mb: 4, display: "flex", alignItems: "center", fontWeight: "bold" }}>
            <Recommend sx={{ mr: 2, color: "primary.main", fontSize: 24 }} />
            Editor's Choices
          </Typography>
          <Grid container spacing={3}>
            {featuredBooks.map((book) => (
              <Grid item xs={12} sm={6} lg={3} key={book}>
                <Card sx={{ transition: "all 0.3s", "&:hover": { boxShadow: 6 } }}>
                  <CardMedia
                    component="img"
                    image={getOptimizedImageUrl(book.bookCover)}
                    alt={`Editor's Choice ${book.title}`}
                    sx={{ aspectRatio: "3 / 4", objectFit: "cover" }}
                  />
                  <CardContent>
                    <Box sx={{ position: "relative", p: 2, background: "linear-gradient(to top, black, transparent)", color: "#fff" }}>
                      <Typography variant="subtitle1">{book.title}</Typography>
                      <Typography variant="body2">{book.authorName}</Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MenuBook sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        Featured
                      </Typography>
                    </Box>
                    <Button variant="outlined" size="small" onClick={() => navigate(`/books/${book.id}`)}>
                      Read Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Tabs Section */}
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 4 }} variant="scrollable">
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TrendingUp />
                Trending Now
              </Box>
            }
            value="trending"
          />
        </Tabs>

        {["trending"].map(
          (tab) =>
            tabValue === tab && (
              <Box key={tab} sx={{ mb: 8 }}>
                <Grid container spacing={3}>
                  {trendingBooks.map((book) => (
                    <Grid item xs={12} sm={6} lg={3} key={book}>
                      <Card sx={{ transition: "all 0.3s", textAlign: "left", "&:hover": { boxShadow: 6 } }}>
                        <CardMedia
                          component="img"
                          image={getOptimizedImageUrl(book.bookCover)}
                          alt={` Book ${book.title}`}
                          onClick={() => navigate(`/books/${book.id}`)}
                          sx={{ aspectRatio: "3 / 4", objectFit: "cover", cursor: "pointer" }}
                        />
                        <CardContent>
                          <Typography variant="subtitle1" sx={{ cursor: "pointer" }} onClick={() => navigate(`/books/${book.id}`)}>
                            {book.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {book.authorName}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <MenuBook sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              Chapter {book.latestChapterNumber}
                            </Typography>
                          </Box>
                          <Button variant="outlined" size="small" onClick={() => navigate(`/books/${book.id}`)}>
                            Read Now
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Button variant="outlined">Load More</Button>
                </Box>
              </Box>
            )
        )}
      </Container>
    </Box>
  );
};
