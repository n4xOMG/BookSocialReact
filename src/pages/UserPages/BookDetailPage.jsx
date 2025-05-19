import { FavoriteBorder, MenuBook, Report } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Button, Grid, IconButton, Rating, Typography, Paper, Container, Divider } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import BookCommentSection from "../../components/BookDetailPageComponents/BookCommentSection";
import { BookDetails } from "../../components/BookDetailPageComponents/BookDetails";
import AuthorCard from "../../components/BookDetailPageComponents/AuthorCard";
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
  getRelatedBooksAction,
  ratingBookAction,
} from "../../redux/book/book.action";
import { isFavouredByReqUser } from "../../utils/isFavouredByReqUser";
import { isTokenExpired, useAuthCheck } from "../../utils/useAuthCheck";
import { clearChapters } from "../../redux/chapter/chapter.action";
import RelatedBooks from "../../components/BookDetailPageComponents/RelatedBooks";
import { createReportAction } from "../../redux/report/report.action";
import ReportModal from "../../components/BookClubs/ReportModal";
import { getOptimizedImageUrl } from "../../utils/optimizeImages";

export const BookDetailPage = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const {
    book,
    relatedBooks,
    rating,
    progresses = [],
    chapterCounts,
    categories,
    tags,
  } = useSelector((store) => ({
    book: store.book.book,
    relatedBooks: store.book.relatedBooks,
    rating: store.book.rating,
    progresses: store.book.progresses,
    categories: store.category.categories,
    tags: store.tag.tags,
  }));
  const { user } = useSelector((store) => store.auth);
  const jwt = localStorage.getItem("jwt");
  const { checkAuth, AuthDialog } = useAuthCheck();
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [firstChapterId, setFirstChapterId] = useState(null);

  const fetchBookAndChapterDetails = useCallback(async () => {
    setLoading(true);
    try {
      const bookResponse = await dispatch(getBookByIdAction(jwt, bookId));
      if (!bookResponse?.payload) {
        console.error("Failed to fetch book data");
        return;
      }

      await dispatch(getAvgBookRating(bookId));
      if (user && !isTokenExpired(jwt)) {
        await dispatch(getAllReadingProgressesByBook(bookId));
        await dispatch(getBookRatingByUserAction(bookId));
      }

      // Use the fresh book data from response to fetch related books
      dispatch(getRelatedBooksAction(bookId, bookResponse.payload.categoryId, bookResponse.payload.tagIds));
    } catch (error) {
      console.error("Error fetching book details:", error);
    } finally {
      setLoading(false);
    }
  }, [bookId, user, jwt, dispatch]);

  const calculateOverallProgress = useCallback(() => {
    if (!book || book.chapterCount === 0) {
      setOverallProgress(0);
      return;
    }

    const totalChapters = book.chapterCount;

    // Sum the progress from all progresses
    const sumProgress = progresses.reduce((acc, progress) => {
      return acc + (progress.progress || 0);
    }, 0);

    // Calculate average progress
    const averageProgress = Math.floor(sumProgress / totalChapters);

    // Ensure progress does not exceed 100%
    setOverallProgress(averageProgress > 100 ? 100 : averageProgress);
  }, [book, progresses]);

  const handleFollowBook = checkAuth(async () => {
    try {
      setLoading(true);
      await dispatch(followBookAction(bookId));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error following book:", error);
    } finally {
      setLoading(false);
    }
  });
  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setReportReason("");
  };

  const handleSubmitReport = checkAuth(async () => {
    if (!reportReason.trim()) {
      alert("Please enter a reason for reporting.");
      return;
    }

    const reportData = {
      reason: reportReason,
      book: { id: bookId },
    };

    try {
      console.log("Report data:", reportData);
      await dispatch(createReportAction(reportData));
      alert("Report submitted successfully.");
      handleCloseReportModal();
    } catch (error) {
      alert("Failed to submit report.");
    }
  });
  const handleRating = checkAuth(async (value) => {
    try {
      setLoading(true);
      await dispatch(ratingBookAction(bookId, value));
    } catch (error) {
      console.error("Error rating book:", error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    // Reset state when bookId changes
    setOverallProgress(0);
    setIsFavorite(false);
    setFirstChapterId(null);

    // Fetch new book data
    fetchBookAndChapterDetails();

    return () => {
      // Clean up when component unmounts or bookId changes
      dispatch({ type: "RESET_BOOK_DETAIL" });
    };
  }, [bookId, fetchBookAndChapterDetails, dispatch]);

  useEffect(() => {
    if (book && user) {
      setIsFavorite(book.followedByCurrentUser);
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

  if (loading || !book) {
    return (
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <LoadingSpinner />
        </Box>
        <AuthDialog />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f9fafb" }}>
      <Sidebar />
      <Box
        sx={{
          width: "100%",
          overflowY: "auto",
          overscrollBehavior: "contain",
          px: 0,
          py: 0,
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid container spacing={4}>
            {/* Left Column - Book Cover and Actions */}
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Box
                  component="img"
                  src={getOptimizedImageUrl(book.bookCover)}
                  alt={`Cover of ${book.title}`}
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)",
                    mb: 3,
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Rating
                      name="book-rating"
                      precision={0.5}
                      value={rating ? rating.rating : 0}
                      onChange={(event, newValue) => handleRating(newValue)}
                    />
                    <Typography variant="body2" sx={{ ml: 1, color: "text.secondary" }}>
                      {rating ? rating.rating?.toFixed(1) : "0.0"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleFollowBook}
                    startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorder />}
                    color={isFavorite ? "error" : "primary"}
                    sx={{ py: 1.5 }}
                  >
                    {isFavorite ? "Following" : "Follow"}
                  </Button>

                  <IconButton
                    onClick={handleOpenReportModal}
                    sx={{
                      border: "1px solid",
                      borderColor: "grey.300",
                      borderRadius: 1,
                      p: 1.5,
                    }}
                  >
                    <Report />
                  </IconButton>
                </Box>

                {firstChapterId && (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate(`/books/${bookId}/chapters/${firstChapterId}`)}
                    sx={{
                      py: 1.5,
                      backgroundColor: "black",
                      color: "white",
                      borderRadius: 1,
                      boxShadow: 3,
                      "&:hover": {
                        backgroundColor: "#333",
                        boxShadow: 4,
                      },
                    }}
                    startIcon={<MenuBook />}
                  >
                    Start Reading
                  </Button>
                )}
              </Paper>

              {/* Progress Section on Mobile/Tablet */}
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Your Progress
                  </Typography>
                  <ProgressBar progress={overallProgress} />
                </Paper>
              </Box>
            </Grid>

            {/* Right Column - Book Details and Content */}
            <Grid item xs={12} md={9}>
              <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mb: 3 }}>
                <BookDetails book={book} categories={categories} tags={tags} />
              </Paper>

              <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mb: 3 }}>
                <AuthorCard author={book.author} checkAuth={checkAuth} />
              </Paper>

              {/* Progress Section on Desktop */}
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Your Progress
                  </Typography>
                  <ProgressBar progress={overallProgress} />
                </Paper>
              </Box>

              <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mb: 3 }}>
                <ChapterList
                  chapterCounts={chapterCounts}
                  progresses={progresses}
                  onCalculateProgress={calculateOverallProgress}
                  onNavigate={navigate}
                  bookId={bookId}
                  user={user ? user : null}
                  onFirstChapterId={setFirstChapterId}
                />
              </Paper>

              <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mb: 3 }}>
                <BookCommentSection bookId={book.id} user={user} />
              </Paper>

              <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mb: 3 }}>
                <RelatedBooks relatedBooks={relatedBooks} loading={loading} categories={categories} tags={tags} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <ReportModal
        open={isReportModalOpen}
        onClose={handleCloseReportModal}
        reportReason={reportReason}
        setReportReason={setReportReason}
        handleSubmitReport={handleSubmitReport}
      />
      <AuthDialog />
    </Box>
  );
};

export default BookDetailPage;
