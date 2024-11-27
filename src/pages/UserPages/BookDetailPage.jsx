import { FavoriteBorder, MenuBook } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Button, Grid, IconButton, Rating, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import BookCommentSection from "../../components/BookDetailPageComponents/BookCommentSection";
import { BookDetails } from "../../components/BookDetailPageComponents/BookDetails";
import { ChapterList } from "../../components/BookDetailPageComponents/ChapterList";
import { ProgressBar } from "../../components/BookDetailPageComponents/ProgressBar";
import Sidebar from "../../components/HomePage/Sidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  followBookAction,
  getAllReadingProgressesByBook,
  getAvgBookRating,
  getBookByIdAction,
  getBookRatingByUserAction,
  ratingBookAction,
} from "../../redux/book/book.action";
import { isFavouredByReqUser } from "../../utils/isFavouredByReqUser";
import { isTokenExpired, useAuthCheck } from "../../utils/useAuthCheck";
import { clearChapters } from "../../redux/chapter/chapter.action";

export const BookDetailPage = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const { book, rating, progresses = [], chapterCounts } = useSelector((store) => store.book);
  const { user } = useSelector((store) => store.auth);
  const jwt = localStorage.getItem("jwt");
  const { checkAuth, AuthDialog } = useAuthCheck();
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [firstChapterId, setFirstChapterId] = useState(null);

  const fetchBookAndChapterDetails = useCallback(async () => {
    setLoading(true);
    await dispatch(getBookByIdAction(bookId));
    await dispatch(getAvgBookRating(bookId));
    if (user && !isTokenExpired(jwt)) {
      await dispatch(getAllReadingProgressesByBook(bookId));
      await dispatch(getBookRatingByUserAction(bookId));
    }
    setLoading(false);
  }, [user, bookId, jwt, dispatch]);

  const calculateOverallProgress = useCallback((chapters, progresses, selectedLanguageId) => {
    const filteredChapters = chapters?.filter((chapter) => chapter.languageId === selectedLanguageId);
    const filteredProgresses = progresses?.filter((progress) => filteredChapters.some((chap) => chap.id === progress.chapterId));
    if (filteredProgresses?.length > 0 && filteredChapters?.length > 0) {
      const totalProgress = filteredProgresses.reduce((acc, progress) => acc + (progress.progress || 0), 0);
      const averageProgress = Math.floor(totalProgress / filteredChapters.length);
      setOverallProgress(averageProgress > 100 ? 100 : averageProgress);
    } else {
      setOverallProgress(0);
    }
  }, []);

  const handleFollowBook = checkAuth(async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        dispatch(followBookAction(bookId));
        setIsFavorite(!isFavorite);
      }, 300);
    } catch (error) {
      console.error("Error following book:", error);
    } finally {
      setLoading(false);
    }
  });

  const handleRating = checkAuth(async (value) => {
    try {
      setLoading(true);
      setTimeout(() => {
        dispatch(ratingBookAction(bookId, value));
      }, 300);
    } catch (error) {
      console.error("Error rating book:", error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchBookAndChapterDetails();
    console.log("Book detail rerendered");
  }, [fetchBookAndChapterDetails]);

  useEffect(() => {
    if (book && user) {
      setIsFavorite(isFavouredByReqUser(user, book));
    }
  }, [book, user]);

  useEffect(() => {
    calculateOverallProgress();
  }, [calculateOverallProgress]);
  useEffect(() => {
    return () => {
      dispatch(clearChapters());
    };
  }, [dispatch]);
  return (
    <Box sx={{ display: "flex", height: "100vh", overscrollBehavior: "contain" }}>
      <Sidebar />
      <Box container="true" sx={{ width: "100%", mx: "auto", px: 2, py: 3, backgroundColor: "#f9fafb" }}>
        {loading || !book ? (
          <LoadingSpinner />
        ) : (
          <Grid container spacing={5} sx={{ backgroundColor: "#f9fafb" }}>
            <Grid item md={3}>
              <Box
                component="img"
                src={book.bookCover}
                alt={`Cover of ${book.title}`}
                sx={{ width: "100%", borderRadius: 2, boxShadow: 3 }}
              />
              <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Rating
                    name="simple-controlled"
                    value={rating ? rating.rating : 0}
                    onChange={(event, newValue) => handleRating(newValue)}
                  />
                  <Typography sx={{ ml: 2, color: "gray.600" }}>{rating ? rating.rating : 0}</Typography>
                </Box>
                <IconButton
                  onClick={handleFollowBook}
                  sx={{
                    backgroundColor: "white",
                    border: "1px solid",
                    borderColor: "grey.300",
                    height: 40,
                    width: 40,
                    "&:hover": {
                      backgroundColor: "grey.100",
                    },
                  }}
                >
                  {isFavorite ? (
                    <FavoriteIcon
                      sx={{
                        width: 16,
                        height: 16,
                        color: "red",
                      }}
                    />
                  ) : (
                    <FavoriteBorder
                      sx={{
                        width: 16,
                        height: 16,
                        color: "black",
                      }}
                    />
                  )}
                </IconButton>
              </Box>
              <Button
                fullWidth
                onClick={() => navigate(`/books/${bookId}/chapters/${firstChapterId}`)}
                sx={{
                  mt: 4,
                  backgroundColor: "black",
                  color: "white",
                  height: 50,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "darkgray",
                  },
                }}
              >
                <MenuBook sx={{ mr: 2, width: 16, height: 16 }} /> Start Reading
              </Button>
            </Grid>
            <Grid item md={8}>
              <BookDetails book={book} />
              <ProgressBar progress={overallProgress} />
              <ChapterList
                chapterCounts={chapterCounts}
                progresses={progresses}
                onCalculateProgress={calculateOverallProgress}
                onNavigate={navigate}
                bookId={bookId}
                user={user ? user : null}
                onFirstChapterId={setFirstChapterId}
              />
              <BookCommentSection bookId={book?.id} user={user} />
            </Grid>
          </Grid>
        )}
      </Box>
      <AuthDialog />
    </Box>
  );
};
