import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getBookByIdAction } from "../../../redux/book/book.action";
import { getCategories } from "../../../redux/category/category.action";
import {
  getAllChaptersByBookIdAction,
  getChapterById,
  getReadingProgressByUserAndChapter,
  unlockChapterAction,
} from "../../../redux/chapter/chapter.action";
import CommentDrawer from "../../ChapterDetailComponents/CommentDrawer";
import LoadingSpinner from "../../LoadingSpinner";
import MangaChapterDetail from "./MangaChapterDetail";
import NovelChapterDetail from "./NovelChapterDetail";
import { isTokenExpired, useAuthCheck } from "../../../utils/useAuthCheck";

// Custom hook for managing chapter data
const useChapterData = () => {
  const dispatch = useDispatch();
  const { bookId, chapterId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const jwt = isTokenExpired(localStorage.getItem("jwt")) ? null : localStorage.getItem("jwt");

  const fetchChapterData = useCallback(async () => {
    if (!bookId || !chapterId) {
      setError("Invalid book or chapter ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Fetch chapter details
      const chapterResponse = await dispatch(getChapterById(chapterId));
      if (chapterResponse.payload?.error) {
        setError(chapterResponse.payload.error);
        return;
      }

      // Fetch all chapters for navigation
      await dispatch(getAllChaptersByBookIdAction(bookId));

      // Fetch book details
      await dispatch(getBookByIdAction(bookId));

      // Fetch categories
      await dispatch(getCategories());

      // Fetch reading progress if user is logged in
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user && jwt) {
        await dispatch(getReadingProgressByUserAndChapter(chapterId));
      }
    } catch (error) {
      console.error("Error fetching chapter data:", error);
      setError("Failed to load chapter data");
    } finally {
      setLoading(false);
    }
  }, [dispatch, bookId, chapterId, jwt]);

  return { fetchChapterData, loading, error };
};

// Custom hook for managing unlock dialogs
const useUnlockDialogs = () => {
  const [unlockDialogOpen, setUnlockDialogOpen] = useState(false);
  const [insufficientCreditsDialogOpen, setInsufficientCreditsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [unlockAttempted, setUnlockAttempted] = useState(false);

  const openUnlockDialog = useCallback(() => {
    if (!unlockAttempted) {
      setUnlockDialogOpen(true);
    }
  }, [unlockAttempted]);

  const closeUnlockDialog = useCallback(() => {
    setUnlockDialogOpen(false);
    setErrorMessage("");
    setUnlockAttempted(true);
  }, []);

  const openInsufficientCreditsDialog = useCallback(() => {
    setInsufficientCreditsDialogOpen(true);
    setUnlockAttempted(true);
  }, []);

  const closeInsufficientCreditsDialog = useCallback(() => {
    setInsufficientCreditsDialogOpen(false);
  }, []);

  const resetUnlockState = useCallback(() => {
    setUnlockAttempted(false);
    setUnlockDialogOpen(false);
    setInsufficientCreditsDialogOpen(false);
    setErrorMessage("");
  }, []);

  return {
    unlockDialogOpen,
    insufficientCreditsDialogOpen,
    errorMessage,
    unlockAttempted,
    setErrorMessage,
    openUnlockDialog,
    closeUnlockDialog,
    openInsufficientCreditsDialog,
    closeInsufficientCreditsDialog,
    resetUnlockState,
  };
};

// Custom hook for determining book type based on category
const useBookType = (book, categories) => {
  return useMemo(() => {
    if (!book || !categories || categories.length === 0) {
      return { isManga: false, isNovel: false, isValid: false };
    }

    const bookCategory = categories.find((cat) => cat.id === book.categoryId);
    if (!bookCategory) {
      return { isManga: false, isNovel: false, isValid: false };
    }

    const categoryName = bookCategory.name.toLowerCase();
    const isManga = categoryName.includes("manga") || categoryName.includes("comic") || categoryName.includes("image");
    const isNovel = categoryName.includes("novel") || categoryName.includes("text") || categoryName.includes("story");

    return { isManga, isNovel, isValid: isManga || isNovel };
  }, [book, categories]);
};

export default function ChapterDetailPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookId, chapterId } = useParams();

  // Redux state
  const { chapter, chapters, readingProgress, unlockError } = useSelector((state) => state.chapter);
  const { user } = useSelector((state) => state.auth);
  const { book } = useSelector((state) => state.book);
  const { categories } = useSelector((state) => state.category);

  // Custom hooks
  const { fetchChapterData, loading, error } = useChapterData();
  const { checkAuth, AuthDialog } = useAuthCheck();
  const unlockDialogs = useUnlockDialogs();
  const bookType = useBookType(book, categories);

  // Local state
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFloatingMenuVisible, setFloatingMenuVisible] = useState(false);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);

  const jwt = isTokenExpired(localStorage.getItem("jwt")) ? null : localStorage.getItem("jwt");

  // Check if chapter is locked
  const isChapterLocked = chapter?.locked && !chapter?.unlockedByUser && chapter?.price > 0;

  // Initialize component
  useEffect(() => {
    fetchChapterData();
  }, [fetchChapterData]);

  // Reset unlock state when chapter changes
  useEffect(() => {
    unlockDialogs.resetUnlockState();
  }, [chapterId, unlockDialogs.resetUnlockState]);

  // Handle locked chapter
  useEffect(() => {
    if (isChapterLocked && chapter && !unlockDialogs.unlockAttempted) {
      unlockDialogs.openUnlockDialog();
    }
  }, [isChapterLocked, chapter, unlockDialogs.unlockAttempted, unlockDialogs.openUnlockDialog]);

  // Handle unlock error
  useEffect(() => {
    if (unlockError) {
      unlockDialogs.openInsufficientCreditsDialog();
    }
  }, [unlockError, unlockDialogs.openInsufficientCreditsDialog]);

  // Navigation handlers
  const handleChapterChange = useCallback(
    (nextChapterId) => {
      navigate(`/books/${bookId}/chapters/${nextChapterId}`);
    },
    [navigate, bookId]
  );

  const handleBackToBook = useCallback(() => {
    navigate(`/books/${bookId}`);
  }, [navigate, bookId]);

  // Menu handlers
  const handleChapterListOpen = useCallback(
    (event) => {
      if (menuOpen) {
        setAnchorEl(null);
        setMenuOpen(false);
      } else {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
      }
    },
    [menuOpen]
  );

  const handleChapterListClose = useCallback(() => {
    setAnchorEl(null);
    setMenuOpen(false);
  }, []);

  const toggleFloatingMenu = useCallback(() => {
    setFloatingMenuVisible((prev) => !prev);
  }, []);

  const toggleSideDrawer = useCallback(() => {
    setIsSideDrawerOpen((prev) => !prev);
  }, []);

  // Unlock handler
  const handleUnlock = checkAuth(async () => {
    if (!user || !jwt) {
      alert("You need to login to unlock this chapter.");
      navigate("/sign-in");
      return;
    }

    try {
      await dispatch(unlockChapterAction(chapter.id));
      unlockDialogs.closeUnlockDialog();
      fetchChapterData(); // Refresh data
    } catch (error) {
      console.error("Error unlocking chapter:", error);
      if (error.response?.status === 400) {
        unlockDialogs.openInsufficientCreditsDialog();
      } else {
        unlockDialogs.setErrorMessage(error.message || "Failed to unlock chapter.");
      }
    }
  });

  // Error dialog handlers
  const handleCloseUnlockDialog = () => {
    unlockDialogs.closeUnlockDialog();
    handleBackToBook();
  };

  const handleCloseInsufficientCreditsDialog = () => {
    unlockDialogs.closeInsufficientCreditsDialog();
    handleBackToBook();
  };

  const handleCloseGeneralError = () => {
    navigate(`/books/${bookId}`);
  };

  // Render loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Render error state
  if (error) {
    return (
      <Dialog open={Boolean(error)} onClose={handleCloseGeneralError}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{error}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGeneralError} color="primary" autoFocus>
            Back to Book
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Common props for chapter detail components
  const commonProps = {
    anchorEl,
    bookId,
    chapter,
    chapters,
    readingProgress,
    user,
    isFloatingMenuVisible,
    toggleFloatingMenu,
    handleChapterChange,
    handleChapterListOpen,
    handleChapterListClose,
    onToggleSideDrawer: toggleSideDrawer,
  };

  return (
    <>
      {/* Unlock Dialog */}
      {isChapterLocked && (
        <Dialog open={unlockDialogs.unlockDialogOpen} onClose={handleCloseUnlockDialog}>
          <DialogTitle>Unlock Chapter</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This chapter is locked and requires <strong>{chapter.price} credits</strong> to unlock. Would you like to proceed?
            </DialogContentText>
            {unlockDialogs.errorMessage && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {unlockDialogs.errorMessage}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUnlockDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleUnlock} color="primary" variant="contained">
              Unlock
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Insufficient Credits Dialog */}
      <Dialog open={unlockDialogs.insufficientCreditsDialogOpen} onClose={handleCloseInsufficientCreditsDialog}>
        <DialogTitle>Insufficient Credits</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You do not have enough credits to unlock this chapter. Please purchase more credits to proceed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInsufficientCreditsDialog} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Chapter Content */}
      {!isChapterLocked && chapter && book && (
        <>
          {bookType.isManga && <MangaChapterDetail {...commonProps} />}
          {bookType.isNovel && <NovelChapterDetail {...commonProps} />}

          {/* Fallback for invalid book type */}
          {!bookType.isValid && (
            <Alert severity="warning" sx={{ m: 4 }}>
              This book does not have a valid type. Please check the book's category configuration.
            </Alert>
          )}

          {/* Comment Drawer */}
          {isSideDrawerOpen && (
            <CommentDrawer open={isSideDrawerOpen} user={user} chapterId={chapter.id} onToggleDrawer={toggleSideDrawer} />
          )}
        </>
      )}

      <AuthDialog />
    </>
  );
}
