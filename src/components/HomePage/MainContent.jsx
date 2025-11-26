import { Explore, MenuBook, Recommend, TrendingUp } from "@mui/icons-material";
import { Box, Button, CircularProgress, Container, Fade, Grid, Tab, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllBookAction } from "../../redux/book/book.action";
import { BookCard } from "./BookCard";
import { BookHeroCarousel } from "./CarouselSlider/BookHeroCarousel";
import TagBarList from "./TagBar/TagBarList";

export const MainContent = memo(({ featuredBooks = [], trendingBooks = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState("trending");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { books, categories, tags } = useSelector(
    (state) => ({
      books: state.book.books,
      categories: state.category.categories,
      tags: state.tag.tags,
    }),
    shallowEqual
  );

  const loader = useRef(null);
  const prevTabRef = useRef(tabValue);

  useEffect(() => {
    if (tabValue === "all" && prevTabRef.current !== "all") {
      setPage(0);
      setHasMore(true);
      dispatch({ type: "GET_ALL_BOOK_SUCCESS", payload: [] });
    }
    prevTabRef.current = tabValue;
  }, [tabValue, dispatch]);

  useEffect(() => {
    if (tabValue !== "all" || !hasMore) return;
    setIsLoading(true);
    dispatch(getAllBookAction(page, 10)).then((result) => {
      if (!result?.payload || (Array.isArray(result.payload) ? result.payload.length === 0 : result.payload.content?.length === 0)) {
        setHasMore(false);
      }
      setIsLoading(false);
    });
  }, [page, tabValue, dispatch, hasMore]);

  const handleTabChange = useCallback((_, newValue) => setTabValue(newValue), []);

  const navigateToBook = useCallback(
    (bookId) => {
      if (!bookId) return;
      dispatch({ type: "RESET_BOOK_DETAIL" });
      navigate(`/books/${bookId}`);
    },
    [navigate, dispatch]
  );

  useEffect(() => {
    if (tabValue !== "all" || !loader.current || !hasMore) return;
    const observer = new window.IntersectionObserver(
      (entities) => {
        const target = entities[0];
        if (target.isIntersecting && !isLoading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { root: null, rootMargin: "100px", threshold: 0.5 }
    );
    observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [tabValue, isLoading, hasMore]);

  const featuredBooksArray = useMemo(() => (Array.isArray(featuredBooks) ? featuredBooks : []), [featuredBooks]);
  const trendingBooksArray = useMemo(() => (Array.isArray(trendingBooks) ? trendingBooks : []), [trendingBooks]);
  const allBooksArray = useMemo(() => (Array.isArray(books) ? books : []), [books]);

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

  const handleTagSelect = (tag) => {
    const params = new URLSearchParams();
    if (tag?.id) {
      params.append("tagIds", tag.id);
    }
    const query = params.toString();
    navigate(query ? `/search-results?${query}` : "/search-results");
  };

  return (
    <Fade in timeout={500}>
      <Box className="fade-in-up">
        <Container maxWidth="xl" sx={{ p: isMobile ? 0 : 3 }}>
          {/* Header Section */}
          <Box sx={{ mb: isMobile ? 2 : 6 }}>
            {!isLoading && trendingBooksArray?.length > 0 && (
              <Box
                sx={{
                  overflow: "hidden",
                  borderRadius: "20px",
                  boxShadow: "0 16px 48px rgba(0, 0, 0, 0.25)",
                  border: "1px solid",
                  borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.35)",
                  mb: isMobile ? 2 : 4,
                }}
              >
                <BookHeroCarousel books={trendingBooksArray} categories={categories} tags={tags} />
              </Box>
            )}

            {/* Tag Bar */}
            <Box sx={{ mt: isMobile ? 1 : 3, mb: isMobile ? 2 : 4 }}>
              <TagBarList onTagSelect={handleTagSelect} tags={tags} />
            </Box>

            <Typography
              variant="h3"
              component="h1"
              className="font-serif"
              sx={{
                mb: 2,
                mt: isMobile ? 2 : 3,
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "3rem", lg: "3.5rem" },
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textAlign: "left",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Discover Your Next Favorite Story
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "1rem", md: "1.125rem" },
                maxWidth: "700px",
                textAlign: "left",
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Explore our curated collection of stories, novels, and poetry across various genres.
            </Typography>
          </Box>

          {/* Editor's Choices Section */}
          {featuredBooksArray.length > 0 && (
            <Box sx={{ mb: { xs: 6, md: 8 } }}>
              <Box
                sx={{
                  mb: 4,
                  p: 2,
                  background: theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.45)" : "rgba(255, 255, 255, 0.22)",
                  backdropFilter: "blur(15px)",
                  border: "1px solid",
                  borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.35)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Recommend
                  sx={{
                    fontSize: 32,
                    color: "primary.main",
                    filter: "drop-shadow(0 2px 8px rgba(157, 80, 187, 0.3))",
                  }}
                />
                <Box>
                  <Typography
                    variant="h5"
                    className="font-serif"
                    sx={{
                      fontWeight: 700,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      mb: 0.5,
                    }}
                  >
                    Editor's Choices
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Handpicked stories from our curators
                  </Typography>
                </Box>
              </Box>
              {renderBookGrid(featuredBooksArray)}
            </Box>
          )}

          {/* Tabs Section */}
          <Box sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons={isMobile ? "auto" : false}
              allowScrollButtonsMobile
              sx={{
                backgroundColor: theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.45)" : "rgba(255, 255, 255, 0.22)",
                backdropFilter: "blur(15px)",
                border: "1px solid",
                borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.35)",
                borderRadius: "16px",
                p: 1,
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  px: 3,
                  borderRadius: "12px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&.Mui-selected": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: "#fff",
                  },
                },
                "& .MuiTabs-indicator": {
                  display: "none",
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
                    All Stories
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

          {/* All Books Section */}
          {tabValue === "all" && (
            <Box sx={{ mb: { xs: 4, md: 6 } }}>
              <Box
                sx={{
                  mb: 4,
                  p: 2,
                  background: theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.45)" : "rgba(255, 255, 255, 0.22)",
                  backdropFilter: "blur(15px)",
                  border: "1px solid",
                  borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.35)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <MenuBook
                  sx={{
                    fontSize: 32,
                    color: "secondary.main",
                    filter: "drop-shadow(0 2px 8px rgba(0, 201, 167, 0.3))",
                  }}
                />
                <Box>
                  <Typography
                    variant="h5"
                    className="font-serif"
                    sx={{
                      fontWeight: 700,
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      mb: 0.5,
                    }}
                  >
                    Explore All Stories
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Browse our complete collection
                  </Typography>
                </Box>
              </Box>
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
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </Fade>
  );
});
