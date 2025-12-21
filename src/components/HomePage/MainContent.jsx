import { Explore, MenuBook, Recommend, TrendingUp } from "@mui/icons-material";
import { Box, Button, CircularProgress, Container, Fade, Tab, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllBookAction, clearAllBooks } from "../../redux/book/book.action";
import { BookHeroCarousel } from "./CarouselSlider/BookHeroCarousel";
import TagBarList from "./TagBar/TagBarList";
import { BookGrid } from "./BookGrid";

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

  // Handle tab change and reset state when switching to "all"
  useEffect(() => {
    if (tabValue === "all" && prevTabRef.current !== "all") {
      setPage(0);
      setHasMore(true);
      dispatch(clearAllBooks());
    }
    prevTabRef.current = tabValue;
  }, [tabValue, dispatch]);

  // Fetch all books for "all" tab
  useEffect(() => {
    if (tabValue !== "all" || !hasMore) return;
    
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const result = await dispatch(getAllBookAction(page, 10));
        if (!result?.payload || (Array.isArray(result.payload) ? result.payload.length === 0 : result.payload.content?.length === 0)) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Failed to fetch books", error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
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

  // Infinite scroll observer
  useEffect(() => {
    if (tabValue !== "all" || !loader.current || !hasMore || isLoading) return;
    
    const observer = new window.IntersectionObserver(
      (entities) => {
        const target = entities[0];
        if (target.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { root: null, rootMargin: "100px", threshold: 0.1 }
    );
    
    observer.observe(loader.current);
    
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [tabValue, isLoading, hasMore]);

  const featuredBooksArray = useMemo(() => (Array.isArray(featuredBooks) ? featuredBooks : []), [featuredBooks]);
  const trendingBooksArray = useMemo(() => (Array.isArray(trendingBooks) ? trendingBooks : []), [trendingBooks]);
  const allBooksArray = useMemo(() => (Array.isArray(books) ? books : []), [books]);

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
                  boxShadow: theme.shadows[4],
                  border: "1px solid",
                  borderColor: theme.palette.divider,
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
                fontSize: { xs: "2rem", md: "3.5rem", lg: "4rem" },
                color: theme.palette.primary.main,
                textAlign: "left",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Discover Your Next <br />
              <Box component="span" sx={{ color: theme.palette.secondary.main, fontStyle: "italic" }}>
                Favorite Story
              </Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "1rem", md: "1.25rem" },
                maxWidth: "700px",
                textAlign: "left",
                fontWeight: 400,
                lineHeight: 1.6,
                fontFamily: "serif",
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
                  p: 3,
                  background: theme.palette.background.paper,
                  border: "1px solid",
                  borderColor: theme.palette.divider,
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  boxShadow: theme.shadows[1],
                }}
              >
                <Recommend sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
                <Box>
                  <Typography
                    variant="h4"
                    className="font-serif"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      mb: 0.5,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Editor's Choices
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontFamily: "serif", fontStyle: "italic" }}>
                    Handpicked stories from our curators
                  </Typography>
                </Box>
              </Box>
              <BookGrid 
                books={featuredBooksArray} 
                onBookClick={navigateToBook} 
                categories={categories} 
                tags={tags} 
              />
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
                backgroundColor: "transparent",
                borderBottom: "1px solid",
                borderColor: theme.palette.divider,
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  px: 4,
                  py: 2,
                  color: "text.secondary",
                  fontFamily: "serif",
                  transition: "all 0.3s ease",
                  "&.Mui-selected": {
                    color: theme.palette.primary.main,
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: theme.palette.secondary.main,
                  height: "3px",
                  borderRadius: "3px 3px 0 0",
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
              <BookGrid 
                books={trendingBooksArray} 
                onBookClick={navigateToBook} 
                categories={categories} 
                tags={tags} 
              />
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
                      borderColor: theme.palette.divider,
                      color: theme.palette.text.primary,
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                      }
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
                  p: 3,
                  background: theme.palette.background.paper,
                  border: "1px solid",
                  borderColor: theme.palette.divider,
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  boxShadow: theme.shadows[1],
                }}
              >
                <MenuBook sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
                <Box>
                  <Typography
                    variant="h4"
                    className="font-serif"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      mb: 0.5,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Explore All Stories
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontFamily: "serif", fontStyle: "italic" }}>
                    Browse our complete collection
                  </Typography>
                </Box>
              </Box>
              {allBooksArray.length > 0 ? (
                <BookGrid 
                  books={allBooksArray} 
                  onBookClick={navigateToBook} 
                  categories={categories} 
                  tags={tags} 
                />
              ) : !isLoading ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : null}
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
