import { Box, Alert, Fade, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainContent } from "../../components/HomePage/MainContent";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getFeaturedBooks, getTrendingBooks, getRecentUpdatedBooks } from "../../redux/book/book.action";

// Custom hook for fetching home page data
const useHomeData = () => {
  const dispatch = useDispatch();
  const { featuredBooks, trendingBooks, latestUpdateBooks, error } = useSelector((state) => state.book);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const isInitialMount = useRef(true);

  const fetchData = useCallback(async () => {
    // Check if we already have data to avoid unnecessary fetches
    // We check each category individually to ensure completeness
    const missingFeatured = !featuredBooks || featuredBooks.length === 0;
    const missingTrending = !trendingBooks || trendingBooks.length === 0;
    const missingLatest = !latestUpdateBooks || latestUpdateBooks.length === 0;

    if (!missingFeatured && !missingTrending && !missingLatest) {
      return;
    }

    setLoading(true);
    try {
      const promises = [];
      if (missingFeatured) promises.push(dispatch(getFeaturedBooks()));
      if (missingTrending) promises.push(dispatch(getTrendingBooks()));
      if (missingLatest) promises.push(dispatch(getRecentUpdatedBooks()));

      await Promise.all(promises);
      setErrorMessage(null);
    } catch (e) {
      console.error("Error fetching book data:", e);
      setErrorMessage("Failed to load books. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [dispatch, featuredBooks, trendingBooks, latestUpdateBooks]);

  useEffect(() => {
    if (isInitialMount.current) {
      fetchData();
      isInitialMount.current = false;
    }
  }, [fetchData]);

  useEffect(() => {
    if (error) {
      setErrorMessage("Something went wrong while loading data.");
    }
  }, [error]);

  return {
    featuredBooks,
    trendingBooks,
    loading,
    errorMessage,
    setErrorMessage
  };
};

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { featuredBooks, trendingBooks, loading, errorMessage, setErrorMessage } = useHomeData();

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: "100%",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          overflow: "auto",
          p: { xs: 1, sm: 2, md: 3 },
          position: "relative",
          pb: isMobile ? 7 : 0,
          zIndex: 1,
          scrollBehavior: "smooth",
        }}
      >
        {loading && (!featuredBooks?.length || !trendingBooks?.length) ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              minHeight: "60vh",
            }}
          >
            <LoadingSpinner />
          </Box>
        ) : errorMessage ? (
          <Fade in={!!errorMessage}>
            <Alert
              severity="error"
              sx={{
                mb: 2,
                backgroundColor: theme.palette.mode === "dark" ? "rgba(205, 92, 92, 0.15)" : "rgba(205, 92, 92, 0.1)",
                backdropFilter: "blur(15px)",
                border: "1px solid",
                borderColor: theme.palette.mode === "dark" ? "rgba(205, 92, 92, 0.3)" : "rgba(205, 92, 92, 0.2)",
                borderRadius: "12px",
                color: theme.palette.text.primary,
                "& .MuiAlert-icon": {
                  color: theme.palette.accent.coral,
                },
              }}
              onClose={() => setErrorMessage(null)}
            >
              {errorMessage}
            </Alert>
          </Fade>
        ) : (
          <MainContent featuredBooks={featuredBooks || []} trendingBooks={trendingBooks || []} />
        )}
      </Box>
    </Box>
  );
}
