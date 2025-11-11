import { FavoriteBorder, MenuBook, Report, StarRate } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Button, Container, Grid, IconButton, Paper, Rating, Typography, useMediaQuery } from "@mui/material";
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
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
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
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <LoadingSpinner />
        </Box>
        <AuthDialog />
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, width: "100%" }}>
      <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 4 }}>
        <Grid
          container
          spacing={isMobile ? 1.5 : 3}
          sx={{
            // Không cần thay đổi ở đây, vì flex-direction chỉ cần 2 giá trị
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          {/* Left Column (Cover/Actions/Sidebar Item) */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              order: isMobile ? 1 : 1,
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? 1.5 : 3,
            }}
          >
            {/* KHỐI 1: Cover/Actions/Rating */}
            <Paper elevation={2} sx={{ p: isMobile ? 1 : 3, borderRadius: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  // Mobile: row, Desktop: column
                  flexDirection: isMobile ? "row" : "column",
                  gap: isMobile ? 1 : 0,
                  alignItems: "flex-start",
                }}
              >
                {/* Cover */}
                <Box
                  sx={{
                    // Mobile: 40%, Desktop: 100%
                    width: isMobile ? "40%" : "100%",
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={book.bookCover}
                    alt={`Cover of ${book.title}`}
                    sx={{
                      width: "100%",
                      borderRadius: 2,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)",
                      // Mobile: 0, Desktop: 1
                      mb: isMobile ? 0 : 1,
                    }}
                  />
                </Box>

                {/* Actions */}
                <Box
                  sx={{
                    // Mobile: 60%, Desktop: 100%
                    width: isMobile ? "60%" : "100%",
                    flexGrow: 1,
                  }}
                >
                  <Box sx={{ mb: 1 }}>
                    <Box
                      sx={{
                        display: "inline-flex",
                        border: "1px solid",
                        borderColor: "#fbc02d",
                        // Mobile: 2, Desktop: 4
                        borderRadius: isMobile ? 2 : 4,
                        p: 0.7,
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          ml: 1,
                          fontWeight: 600,
                          color: "#fbc02d",
                          // Desktop only
                          display: isMobile ? "none" : "block",
                        }}
                      >
                        Average rating: {book.avgRating ? book.avgRating.toFixed(1) : "0.0"} / 5.0
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          ml: 1,
                          fontWeight: 600,
                          color: "#fbc02d",
                          // Mobile only
                          display: isMobile ? "block" : "none",
                        }}
                      >
                        Rating: {book.avgRating ? book.avgRating.toFixed(1) : "0.0"} / 5.0
                      </Typography>
                      <StarRate fontSize="small" sx={{ color: "#fbc02d", ml: 0.5 }} />
                    </Box>
                  </Box>

                  {/* Rating */}
                  <Box sx={{ mb: isMobile ? 2 : 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        // Mobile: column, Desktop: row
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: "center",
                      }}
                    >
                      <Rating
                        name="book-rating"
                        precision={0.5}
                        value={rating ? rating.rating : 0}
                        onChange={(event, newValue) => handleRating(newValue)}
                      />
                      {rating?.rating && (
                        <Typography
                          variant="body2"
                          sx={{
                            // Mobile: 0, Desktop: 1
                            ml: isMobile ? 0 : 1,
                            color: "text.secondary",
                          }}
                        >
                          You rated {rating.rating?.toFixed(1)} !
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Follow + Report */}
                  <Box sx={{ display: "flex", gap: isMobile ? 1 : 2, mb: isMobile ? 1.5 : 3 }}>
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

                  {/* Start Reading */}
                  {firstChapterId && (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate(`/books/${bookId}/chapters/${firstChapterId}`)}
                      sx={{
                        py: 1.5,
                        backgroundColor: "primary.dark",
                        color: "primary.contrastText",
                        borderRadius: 1,
                        boxShadow: 3,
                        "&:hover": {
                          backgroundColor: "primary.light",
                          boxShadow: 4,
                        },
                      }}
                      startIcon={<MenuBook />}
                    >
                      Start Reading
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>

            {/* KHỐI 7: Box Tab (Top Book of Day/Week/Month) */}
            <Box
              sx={{
                p: 2,
                bgcolor: "lightcoral",
                // Ẩn trên mobile
                display: isMobile ? "none" : "block",
                order: isMobile ? 8 : 2,
              }}
            >
              <Typography>Box Tab (Top Book of Day/Week/Month)</Typography>
            </Box>
          </Grid>

          {/* Right Column - Book Details + Content */}
          <Grid
            item
            xs={12}
            md={9}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? 1.5 : 3,
              order: isMobile ? 2 : 2,
            }}
          >
            {/* Book Details */}
            <Paper
              elevation={2}
              sx={{
                order: isMobile ? 2 : "initial",
                p: isMobile ? 1 : 4,
                borderRadius: 2,
              }}
            >
              <BookDetails book={book} categories={categories} tags={tags} />
            </Paper>

            {/* Author */}
            <Paper
              elevation={2}
              sx={{
                order: isMobile ? 3 : "initial",
                p: isMobile ? 1 : 4,
                borderRadius: 2,
              }}
            >
              <AuthorCard author={book.author} checkAuth={checkAuth} />
            </Paper>

            {/* Progress */}
            <Box sx={{ order: isMobile ? 4 : "initial" }}>
              <Paper elevation={2} sx={{ p: isMobile ? 1 : 4, borderRadius: 2 }}>
                <ProgressBar progress={overallProgress} />
              </Paper>
            </Box>

            {/* Chapter List */}
            <Paper
              elevation={2}
              sx={{
                order: isMobile ? 5 : "initial",
                p: isMobile ? 1 : 4,
                borderRadius: 2,
              }}
            >
              <ChapterList
                chapters={chapters}
                progresses={progresses}
                onNavigate={navigate}
                bookId={bookId}
                user={user || null}
                onFirstChapterId={setFirstChapterId}
              />
            </Paper>

            {/* Comments + Related */}
            <Suspense fallback={<LoadingSpinner />}>
              <Paper
                elevation={2}
                sx={{
                  order: isMobile ? 6 : "initial",
                  p: isMobile ? 1 : 4,
                  borderRadius: 2,
                }}
              >
                <BookCommentSection bookId={book.id} user={user} />
              </Paper>
              <Paper
                elevation={2}
                sx={{
                  order: isMobile ? 7 : "initial",
                  p: isMobile ? 1 : 4,
                  borderRadius: 2,
                }}
              >
                <RelatedBooks relatedBooks={relatedBooks} loading={loading} categories={categories} tags={tags} />
              </Paper>
            </Suspense>
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
