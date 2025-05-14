import { MenuBook, Recommend, TrendingUp } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography,
  Chip,
  Skeleton,
  useMediaQuery,
  useTheme,
  Fade,
} from "@mui/material";
import React, { useState, memo, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getOptimizedImageUrl } from "../../utils/optimizeImages";

// Memoized BookCard component for better performance
const BookCard = memo(({ book, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageLoad = () => setImageLoaded(true);

  return (
    <Card
      elevation={isHovered ? 6 : 2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s, box-shadow 0.3s",
        transform: isHovered ? "translateY(-5px)" : "none",
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box sx={{ position: "relative", paddingTop: "140%" }}>
        {!imageLoaded && (
          <Skeleton
            variant="rectangular"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
            }}
            animation="wave"
          />
        )}
        <CardMedia
          component="img"
          image={getOptimizedImageUrl(book.bookCover)}
          alt={book.title}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imageLoaded ? 1 : 0,
            transition: "opacity 0.5s",
          }}
          onLoad={handleImageLoad}
          loading="lazy"
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            m: 1,
            zIndex: 2,
          }}
        >
          {book.editorChoice && <Chip label="Editor's Choice" size="small" color="primary" sx={{ mb: 1 }} />}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography
          variant="subtitle1"
          component="h3"
          fontWeight="bold"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            cursor: "pointer",
            "&:hover": { color: "primary.main" },
          }}
          onClick={() => onClick(book.id)}
        >
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          by {book.authorName}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", p: 2, pt: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MenuBook sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {book.latestChapterNumber ? `Ch ${book.latestChapterNumber}` : "New"}
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={() => onClick(book.id)}
          disableElevation
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            px: 2,
          }}
        >
          Read Now
        </Button>
      </CardActions>
    </Card>
  );
});

// Main content component
export const MainContent = memo(({ featuredBooks = [], trendingBooks = [] }) => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState("trending");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const navigateToBook = useCallback(
    (bookId) => {
      navigate(`/books/${bookId}`);
    },
    [navigate]
  );

  // Memoize the book arrays to prevent unnecessary renders
  const featuredBooksArray = useMemo(() => (Array.isArray(featuredBooks) ? featuredBooks : []), [featuredBooks]);

  const trendingBooksArray = useMemo(() => (Array.isArray(trendingBooks) ? trendingBooks : []), [trendingBooks]);

  return (
    <Fade in timeout={500}>
      <Box sx={{ height: "100%", backgroundColor: "background.default" }}>
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
          {/* Header Section */}
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                mb: 2,
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "2.5rem" },
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Discover Your Next Favorite Book
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "1rem", md: "1.125rem" },
                maxWidth: "700px",
              }}
            >
              Explore our curated collection of books across various genres.
            </Typography>
          </Box>

          {/* Editor's Choices Section */}
          {featuredBooksArray.length > 0 && (
            <Box sx={{ mb: { xs: 6, md: 8 } }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 700,
                  py: 1,
                  borderBottom: `2px solid ${theme.palette.divider}`,
                }}
              >
                <Recommend sx={{ mr: 1.5, color: "primary.main" }} />
                Editor's Choices
              </Typography>

              <Grid container spacing={3}>
                {featuredBooksArray.map((book) => (
                  <Grid item xs={6} sm={4} md={3} lg={2.4} key={book.id || book.title}>
                    <BookCard book={book} onClick={navigateToBook} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Tabs Section */}
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons={isMobile ? "auto" : false}
              allowScrollButtonsMobile
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  px: 3,
                },
              }}
            >
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
          </Box>

          {/* Trending Books Section */}
          {tabValue === "trending" && (
            <Box sx={{ mb: { xs: 4, md: 6 } }}>
              <Grid container spacing={3}>
                {trendingBooksArray.map((book) => (
                  <Grid item xs={6} sm={4} md={3} lg={2.4} key={book.id || book.title}>
                    <BookCard book={book} onClick={navigateToBook} />
                  </Grid>
                ))}
              </Grid>

              {trendingBooksArray.length > 0 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: "30px",
                      px: 4,
                      py: 1,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Load More
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </Fade>
  );
});
