import { Box, Alert, Fade, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainContent } from "../../components/HomePage/MainContent";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getFeaturedBooks, getTrendingBooks, getRecentUpdatedBooks } from "../../redux/book/book.action";

export default function HomePage() {
  const dispatch = useDispatch();
  const { featuredBooks, trendingBooks, latestUpdateBooks, error } = useSelector((state) => state.book);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isInitialMount = useRef(true);

  const fetchData = useCallback(async () => {
    if (featuredBooks?.length && trendingBooks?.length && latestUpdateBooks?.length) {
      return;
    }

    setLoading(true);
    try {
      const promises = [];
      if (!featuredBooks?.length) {
        promises.push(dispatch(getFeaturedBooks()));
      }
      if (!trendingBooks?.length) {
        promises.push(dispatch(getTrendingBooks()));
      }
      if (!latestUpdateBooks?.length) {
        promises.push(dispatch(getRecentUpdatedBooks()));
      }

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

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: "100%",
        minHeight: "100vh",
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
        }}
      >
        {loading ? (
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
                backgroundColor: "rgba(255, 107, 107, 0.15)",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255, 107, 107, 0.3)",
                borderRadius: "12px",
                color: "text.primary",
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
