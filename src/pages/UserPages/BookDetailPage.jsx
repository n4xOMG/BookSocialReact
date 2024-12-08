import { FavoriteBorder, MenuBook, Report } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Button, Grid, IconButton, Rating, Typography } from "@mui/material";
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
    await dispatch(getBookByIdAction(bookId));
    await dispatch(getAvgBookRating(bookId));
    if (user && !isTokenExpired(jwt)) {
      await dispatch(getAllReadingProgressesByBook(bookId));
      await dispatch(getBookRatingByUserAction(bookId));
    }
    if (book) {
      dispatch(getRelatedBooksAction(bookId, book.categoryId, book.tagIds));
    }
    setLoading(false);
  }, [user, bookId, jwt, dispatch]);

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
    <Box sx={{ display: "flex", height: "100vh", overscrollBehavior: "contain" }}>
      <Sidebar />
      <Box
        container="true"
        sx={{
          width: "100%",
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: 3,
          backgroundColor: "#f9fafb",
          overflowY: "auto",
        }}
      >
        <Grid container spacing={5} sx={{ backgroundColor: "#f9fafb" }}>
          <Grid item md={3}>
            <Box
              component="img"
              src={getOptimizedImageUrl(book.bookCover)}
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
                onClick={handleOpenReportModal}
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
                <Report />
              </IconButton>
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
                      width: 24,
                      height: 24,
                      color: "red",
                    }}
                  />
                ) : (
                  <FavoriteBorder
                    sx={{
                      width: 24,
                      height: 24,
                      color: "black",
                    }}
                  />
                )}
              </IconButton>
            </Box>
            {firstChapterId && (
              <Button
                fullWidth
                onClick={() => navigate(`/books/${bookId}/chapters/${firstChapterId}`)}
                sx={{
                  mt: 4,
                  backgroundColor: "black",
                  color: "white",
                  height: 50,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    backgroundColor: "darkgray",
                  },
                }}
              >
                <MenuBook sx={{ mr: 2, width: 20, height: 20 }} /> Start Reading
              </Button>
            )}
          </Grid>
          <Grid item md={8}>
            <BookDetails book={book} categories={categories} tags={tags} />
            <AuthorCard author={book.author} checkAuth={checkAuth} />
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
            <BookCommentSection bookId={book.id} user={user} />
            <RelatedBooks relatedBooks={relatedBooks} loading={loading} categories={categories} tags={tags} />
          </Grid>
        </Grid>
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
