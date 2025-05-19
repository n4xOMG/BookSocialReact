import { Box, Alert, Fade, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/HomePage/Header";
import { MainContent } from "../../components/HomePage/MainContent";
import { Sidebar } from "../../components/HomePage/Sidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getFeaturedBooks, getTrendingBooks } from "../../redux/book/book.action";

export default function HomePage() {
  const dispatch = useDispatch();
  const { featuredBooks, trendingBooks, error } = useSelector((state) => state.book);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isInitialMount = useRef(true);

  const fetchData = useCallback(async () => {
    // Avoid refetching if we already have data
    if (featuredBooks?.length && trendingBooks?.length) {
      return;
    }

    setLoading(true);
    try {
      // Use Promise.all to fetch data in parallel
      const promises = [];
      if (!featuredBooks?.length) {
        promises.push(dispatch(getFeaturedBooks()));
      }
      if (!trendingBooks?.length) {
        promises.push(dispatch(getTrendingBooks()));
      }

      await Promise.all(promises);
      setErrorMessage(null);
    } catch (e) {
      console.error("Error fetching book data:", e);
      setErrorMessage("Failed to load books. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [dispatch, featuredBooks, trendingBooks]);

  useEffect(() => {
    // Only fetch on initial mount
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
        display: "flex",
        height: "100vh",
        overscrollBehavior: "contain",
        backgroundColor: "background.default",
      }}
    >
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          width: "100%",
          // Add padding at the bottom on mobile to account for the bottom drawer toggle
          pb: isMobile ? 7 : 0,
        }}
      >
        <Header />
        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: "auto",
            p: { xs: 1, sm: 2, md: 3 },
            position: "relative",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <LoadingSpinner />
            </Box>
          ) : errorMessage ? (
            <Fade in={!!errorMessage}>
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage(null)}>
                {errorMessage}
              </Alert>
            </Fade>
          ) : (
            <MainContent featuredBooks={featuredBooks || []} trendingBooks={trendingBooks || []} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
