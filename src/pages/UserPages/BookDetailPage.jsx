import { FavoriteBorder, MenuBook, Report } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Button, Container, Grid, IconButton, Paper, Rating, Typography } from "@mui/material";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import ReportModal from "../../components/BookClubs/ReportModal";
import AuthorCard from "../../components/BookDetailPageComponents/AuthorCard";
import { BookDetails } from "../../components/BookDetailPageComponents/BookDetails";
import { ChapterList } from "../../components/BookDetailPageComponents/ChapterList";
import { ProgressBar } from "../../components/BookDetailPageComponents/ProgressBar";
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
import { clearChapters, getAllChaptersByBookIdAction } from "../../redux/chapter/chapter.action";
import { createReportAction } from "../../redux/report/report.action";
import { isTokenExpired, useAuthCheck } from "../../utils/useAuthCheck";
// Lazy load heavy components
const BookCommentSection = React.lazy(() => import("../../components/BookDetailPageComponents/BookCommentSection"));
const RelatedBooks = React.lazy(() => import("../../components/BookDetailPageComponents/RelatedBooks"));
export const BookDetailPage = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [firstChapterId, setFirstChapterId] = useState(null);

  // Centralized state
  const {
    book,
    relatedBooks,
    rating,
    progresses = [],
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
  const { chapters } = useSelector((store) => store.chapter);
  const jwt = localStorage.getItem("jwt");
  const { checkAuth, AuthDialog } = useAuthCheck();

  // Fetch all book-related data in one effect
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setIsFavorite(false);
    setFirstChapterId(null);

    const fetchAll = async () => {
      try {
        // Fetch book
        const bookRes = await dispatch(getBookByIdAction(jwt, bookId));
        if (!bookRes?.payload) return;

        // Fetch chapters
        const chaptersRes = await dispatch(getAllChaptersByBookIdAction(jwt, bookId));
        const chapterList = chaptersRes?.payload || [];
        if (chapterList.length > 0) setFirstChapterId(chapterList[0].id);

        // Fetch ratings and progresses only if user is logged in
        await Promise.all([
          dispatch(getAvgBookRating(bookId)),
          user && !isTokenExpired(jwt)
            ? Promise.all([dispatch(getAllReadingProgressesByBook(bookId)), dispatch(getBookRatingByUserAction(bookId))])
            : null,
        ]);

        // Related books (use fresh book data)
        dispatch(getRelatedBooksAction(bookId, bookRes.payload.categoryId, bookRes.payload.tagIds));
      } catch (e) {
        // ignore
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAll();

    return () => {
      isMounted = false;
      dispatch({ type: "RESET_BOOK_DETAIL" });
      dispatch(clearChapters());
    };
    // eslint-disable-next-line
  }, [bookId, dispatch, jwt, user]);

  // Keep isFavorite in sync with book.followedByCurrentUser
  useEffect(() => {
    if (book && user) setIsFavorite(book.followedByCurrentUser);
  }, [book, user]);

  // Memoized overall progress calculation
  const overallProgress = useMemo(() => {
    if (!book || !book.chapterCount || !progresses?.length) return 0;
    const totalChapters = book.chapterCount;
    const sumProgress = progresses.reduce((acc, progress) => acc + (progress.progress || 0), 0);
    const avg = Math.floor(sumProgress / totalChapters);
    return avg > 100 ? 100 : avg;
  }, [book, progresses]);

  const handleFollowBook = checkAuth(async () => {
    try {
      setLoading(true);
      await dispatch(followBookAction(bookId));
      setIsFavorite((prev) => !prev);
    } catch (error) {
      // ignore
    } finally {
      setLoading(false);
    }
  });

  const handleOpenReportModal = () => setIsReportModalOpen(true);
  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setReportReason("");
  };

  const handleSubmitReport = checkAuth(async () => {
    if (!reportReason.trim()) {
      alert("Please enter a reason for reporting.");
      return;
    }
    const reportData = { reason: reportReason, book: { id: bookId } };
    try {
      await dispatch(createReportAction(reportData));
      alert("Report submitted successfully.");
      handleCloseReportModal();
    } catch {
      alert("Failed to submit report.");
    }
  });

  const handleRating = checkAuth(async (value) => {
    try {
      setLoading(true);
      await dispatch(ratingBookAction(bookId, value));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  });

  if (loading || !book) {
    return (
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <LoadingSpinner />
        </Box>
        <AuthDialog />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f9fafb" }}>
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
                  src={book.bookCover}
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
                  chapters={chapters}
                  progresses={progresses}
                  onNavigate={navigate}
                  bookId={bookId}
                  user={user ? user : null}
                  onFirstChapterId={setFirstChapterId}
                />
              </Paper>

              <Suspense fallback={<LoadingSpinner />}>
                <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mb: 3 }}>
                  <BookCommentSection bookId={book.id} user={user} />
                </Paper>
                <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mb: 3 }}>
                  <RelatedBooks relatedBooks={relatedBooks} loading={loading} categories={categories} tags={tags} />
                </Paper>
              </Suspense>
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
