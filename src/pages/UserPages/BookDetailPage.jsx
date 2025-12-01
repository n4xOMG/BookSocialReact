import { FavoriteBorder, MenuBook, Report, StarRate } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Button, Container, Grid, IconButton, Paper, Rating, Typography, useMediaQuery, useTheme } from "@mui/material";
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
  recordBookViewAction,
} from "../../redux/book/book.action";
import { clearChapters, getAllChaptersByBookIdAction } from "../../redux/chapter/chapter.action";
import { createReportAction } from "../../redux/report/report.action";
import { isTokenExpired, useAuthCheck } from "../../utils/useAuthCheck";

const BookCommentSection = React.lazy(() => import("../../components/BookDetailPageComponents/BookCommentSection"));
const RelatedBooks = React.lazy(() => import("../../components/BookDetailPageComponents/RelatedBooks"));

export const BookDetailPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setIsFavorite(false);
    setFirstChapterId(null);

    const fetchAll = async () => {
      try {
        const bookRes = await dispatch(getBookByIdAction(bookId));
        if (!bookRes?.payload) return;

        const chaptersRes = await dispatch(getAllChaptersByBookIdAction(bookId));
        const chapterList = chaptersRes?.payload || [];
        if (chapterList.length > 0) setFirstChapterId(chapterList[0].id);

        await Promise.all([
          dispatch(getAvgBookRating(bookId)),
          user && !isTokenExpired(jwt)
            ? Promise.all([dispatch(getAllReadingProgressesByBook(bookId)), dispatch(getBookRatingByUserAction(bookId))])
            : null,
        ]);

        dispatch(getRelatedBooksAction(bookId, bookRes.payload.categoryId, bookRes.payload.tagIds));
        dispatch(recordBookViewAction(bookId));
      } catch (e) {
        console.error("Error fetching book details:", e);
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
  }, [bookId, dispatch, jwt, user]);

  useEffect(() => {
    if (book && user) setIsFavorite(book.followedByCurrentUser);
  }, [book, user]);

  // Memoized overall progress calculation
  const overallProgress = useMemo(() => {
    if (!book || !book.chapterCount || !progresses?.length) return 0;
    const totalChapters = book.chapterCount;
    const sumProgress = progresses.reduce((acc, progress) => {
      const raw = progress?.progress;
      const numeric = typeof raw === "number" ? raw : parseFloat(raw);
      return acc + (Number.isFinite(numeric) ? numeric : 0);
    }, 0);
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
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner />
        <AuthDialog />
      </Box>
    );
  }

  const paperStyle = {
    p: { xs: 2, md: 4 },
    borderRadius: "20px",
    bgcolor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[1],
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: theme.shadows[4],
      borderColor: theme.palette.primary.main,
    },
  };

  return (
    <Box sx={{ flex: 1, width: "100%", minHeight: "100vh", bgcolor: theme.palette.background.default }}>
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Grid container spacing={4}>
          {/* Left Column (Cover/Actions/Rating) */}
          <Grid item xs={12} md={3.5} lg={3}>
            <Box sx={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 3 }}>
              <Paper elevation={0} sx={paperStyle}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
                  {/* Cover Image */}
                  <Box
                    component="img"
                    src={book.bookCover}
                    alt={`Cover of ${book.title}`}
                    sx={{
                      width: "100%",
                      borderRadius: "12px",
                      boxShadow: theme.shadows[6],
                      aspectRatio: "2/3",
                      objectFit: "cover",
                    }}
                  />

                  {/* Rating Badge */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: theme.palette.warning.light + "20",
                      color: theme.palette.warning.main,
                      px: 2,
                      py: 1,
                      borderRadius: "12px",
                      border: `1px solid ${theme.palette.warning.main}40`,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {book.avgRating ? book.avgRating.toFixed(1) : "0.0"}
                    </Typography>
                    <StarRate fontSize="small" />
                  </Box>

                  {/* User Rating */}
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                    <Rating
                      name="book-rating"
                      precision={0.5}
                      value={rating ? rating.rating : 0}
                      onChange={(event, newValue) => handleRating(newValue)}
                      size="large"
                    />
                    {rating?.rating && (
                      <Typography variant="caption" color="text.secondary" mt={0.5}>
                        You rated: {rating.rating.toFixed(1)}
                      </Typography>
                    )}
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                    <Button
                      fullWidth
                      variant={isFavorite ? "contained" : "outlined"}
                      onClick={handleFollowBook}
                      startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorder />}
                      color="primary"
                      sx={{
                        borderRadius: "12px",
                        py: 1.2,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      {isFavorite ? "Following" : "Follow"}
                    </Button>

                    <IconButton
                      onClick={handleOpenReportModal}
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: "12px",
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          color: theme.palette.error.main,
                          borderColor: theme.palette.error.main,
                          bgcolor: theme.palette.error.light + "10",
                        },
                      }}
                    >
                      <Report />
                    </IconButton>
                  </Box>

                  {/* Start Reading Button */}
                  {firstChapterId && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={() => navigate(`/books/${bookId}/chapters/${firstChapterId}`)}
                      startIcon={<MenuBook />}
                      sx={{
                        borderRadius: "12px",
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "1rem",
                        boxShadow: theme.shadows[4],
                      }}
                    >
                      Start Reading
                    </Button>
                  )}
                </Box>
              </Paper>
            </Box>
          </Grid>

          {/* Right Column (Details, Author, Chapters, Comments) */}
          <Grid item xs={12} md={8.5} lg={9}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Book Details */}
              <Paper elevation={0} sx={paperStyle}>
                <BookDetails book={book} categories={categories} tags={tags} />
              </Paper>

              {/* Author */}
              <Paper elevation={0} sx={paperStyle}>
                <AuthorCard author={book.author} checkAuth={checkAuth} />
              </Paper>

              {/* Progress */}
              {user && (
                <Paper elevation={0} sx={paperStyle}>
                  <ProgressBar progress={overallProgress} />
                </Paper>
              )}

              {/* Chapter List */}
              <Paper elevation={0} sx={paperStyle}>
                <ChapterList
                  chapters={chapters}
                  progresses={progresses}
                  onNavigate={navigate}
                  bookId={bookId}
                  user={user || null}
                  onFirstChapterId={setFirstChapterId}
                />
              </Paper>

              {/* Comments & Related Books */}
              <Suspense fallback={<LoadingSpinner />}>
                <Paper elevation={0} sx={paperStyle}>
                  <BookCommentSection bookId={book.id} user={user} />
                </Paper>
                <Paper elevation={0} sx={paperStyle}>
                  <RelatedBooks relatedBooks={relatedBooks} loading={loading} categories={categories} tags={tags} />
                </Paper>
              </Suspense>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Modals */}
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
