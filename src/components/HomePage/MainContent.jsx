import { Autorenew, Explore, MenuBook, Recommend, TrendingUp } from "@mui/icons-material";
import { Box, Button, CircularProgress, Container, Fade, Grid, Tab, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllBookAction } from "../../redux/book/book.action";
import { BookCard } from "./BookCard";

// Main content component
export const MainContent = memo(({ featuredBooks = [], trendingBooks = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState("trending");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { books, categories, tags } = useSelector((state) => ({
    books: state.book.books,
    categories: state.category.categories,
    tags: state.tag.tags,
  }));

  const loader = useRef(null);
  const prevTabRef = useRef(tabValue);

  // Reset books and page when switching to "all" tab
  useEffect(() => {
    if (tabValue === "all" && prevTabRef.current !== "all") {
      setPage(0);
      setHasMore(true);
      dispatch({ type: "GET_ALL_BOOK_SUCCESS", payload: [] });
    }
    prevTabRef.current = tabValue;
  }, [tabValue, dispatch]);

  // Load books when page changes and tab is "all"
  useEffect(() => {
    if (tabValue !== "all" || !hasMore) return;
    setIsLoading(true);
    dispatch(getAllBookAction(page, 10)).then((result) => {
      if (!result?.payload || result.payload.length === 0) {
        setHasMore(false);
      }
      setIsLoading(false);
    });
  }, [page, tabValue, dispatch, hasMore]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const navigateToBook = useCallback(
    (bookId) => {
      if (!bookId) {
        console.error("Invalid book ID:", bookId);
        return;
      }

      // Reset book data in Redux before navigation
      dispatch({ type: "RESET_BOOK_DETAIL" });

      // Navigate to book detail page
      navigate(`/books/${bookId}`);
    },
    [navigate, dispatch]
  );

  // Infinite scroll observer
  useEffect(() => {
    if (tabValue !== "all" || !loader.current || !hasMore) return;
    const options = {
      root: null,
      rootMargin: "100px",
      threshold: 0.5,
    };
    const observer = new IntersectionObserver((entities) => {
      const target = entities[0];
      if (target.isIntersecting && !isLoading && hasMore) {
        setPage((prev) => prev + 1);
      }
    }, options);
    observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [tabValue, isLoading, hasMore]);

  // Memoize the book arrays to prevent unnecessary renders
  const featuredBooksArray = useMemo(() => (Array.isArray(featuredBooks) ? featuredBooks : []), [featuredBooks]);
  const trendingBooksArray = useMemo(() => (Array.isArray(trendingBooks) ? trendingBooks : []), [trendingBooks]);
  const allBooksArray = useMemo(() => (Array.isArray(books) ? books : []), [books]);

  // Use memo for book card grids to prevent unnecessary rerenders
  const renderBookGrid = useCallback(
    (bookList) => (
      <Grid container spacing={3}>
        {bookList.map((book) => (
          <Grid item xs={6} sm={4} md={3} lg={2.4} key={book.id || book.title}>
            <BookCard book={book} onClick={() => navigateToBook(book.id)} categories={categories} tags={tags} />
          </Grid>
        ))}
      </Grid>
    ),
    [categories, tags, navigateToBook]
  );

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

              {renderBookGrid(featuredBooksArray)}
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
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Explore />
                    All Books
                  </Box>
                }
                value="all"
              />
            </Tabs>
          </Box>

          {/* Trending Books Section */}
          {tabValue === "trending" && (
            <Box sx={{ mb: { xs: 4, md: 6 } }}>
              {renderBookGrid(trendingBooksArray)}

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

          {/* All Books Section with optimized Infinite Scroll */}
          {tabValue === "all" && (
            <Box sx={{ mb: { xs: 4, md: 6 } }}>
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
                <MenuBook sx={{ mr: 1.5, color: "primary.main" }} />
                Explore All Books
              </Typography>

              {allBooksArray.length > 0 ? (
                renderBookGrid(allBooksArray)
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CircularProgress size={30} />
                </Box>
              )}

              <Box
                ref={loader}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 4,
                  width: "100%",
                  minHeight: "60px",
                }}
              >
                {isLoading && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" color="text.secondary">
                      Loading more books...
                    </Typography>
                  </Box>
                )}
                {!isLoading && !hasMore && allBooksArray.length > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    You've reached the end of the list
                  </Typography>
                )}
                {!isLoading && hasMore && allBooksArray.length > 0 && !isMobile && (
                  <Button
                    startIcon={<Autorenew />}
                    variant="outlined"
                    sx={{
                      borderRadius: "30px",
                      px: 4,
                      py: 1,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Load More Books
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </Fade>
  );
});
