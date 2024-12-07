import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/HomePage/Header";
import { MainContent } from "../../components/HomePage/MainContent";
import { Sidebar } from "../../components/HomePage/Sidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getFeaturedBooks, getTrendingBooks } from "../../redux/book/book.action";

export default function HomePage() {
  const dispatch = useDispatch();
  const { featuredBooks, trendingBooks } = useSelector((state) => state.book);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    try {
      dispatch(getFeaturedBooks());
      dispatch(getTrendingBooks());
    } catch (e) {
      console.log("Error fetching top categories:", e);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ display: "flex", height: "100vh", overscrollBehavior: "contain" }}>
          <Sidebar />
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Header />
            <Box component="main" sx={{ flex: 1, overflow: "auto", p: 3 }}>
              <MainContent featuredBooks={featuredBooks} trendingBooks={trendingBooks} />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
