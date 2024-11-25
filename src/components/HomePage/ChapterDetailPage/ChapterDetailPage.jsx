import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getBookByIdAction } from "../../../redux/book/book.action";
import {
  getAllChaptersByBookIdAction,
  getChapterById,
  getReadingProgressByUserAndChapter,
  unlockChapterAction,
} from "../../../redux/chapter/chapter.action";
import { getTags } from "../../../redux/tag/tag.action";
import CommentDrawer from "../../ChapterDetailComponents/CommentDrawer";
import LoadingSpinner from "../../LoadingSpinner";
import MangaChapterDetail from "./MangaChapterDetail";
import NovelChapterDetail from "./NovelChapterDetail";
import { isTokenExpired } from "../../../utils/useAuthCheck";

export default function ChapterDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chapter, chapters, readingProgress, error } = useSelector((store) => store.chapter);
  const { user } = useSelector((store) => store.auth);
  const { book } = useSelector((store) => store.book);
  const { tags } = useSelector((store) => store.tag);
  const { bookId: paramBookId, chapterId: paramChapterId } = useParams();

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFloatingMenuVisible, setFloatingMenuVisible] = useState(false);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [bookId] = useState(paramBookId);
  const [chapterId, setChapterId] = useState(paramChapterId);
  const [loading, setLoading] = useState(true);

  const [unlockDialogOpen, setUnlockDialogOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [generalError, setGeneralError] = useState("");
  const jwt = isTokenExpired(localStorage.getItem("jwt")) ? null : localStorage.getItem("jwt");
  const fetchChapterDetail = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(getChapterById(jwt, bookId, chapterId));
      if (chapters.length === 0) {
        await dispatch(getAllChaptersByBookIdAction(jwt, bookId));
      }
      if (tags.length === 0) {
        await dispatch(getTags());
      }
      if (!book) {
        await dispatch(getBookByIdAction(bookId));
      }
      if (user) {
        await dispatch(getReadingProgressByUserAndChapter(chapterId));
      }
    } catch (e) {
      console.log("Error in chapter detail: ", e);
      if (error) {
        console.log("Error in chapter detail: ", error);
        setGeneralError(error);
        setUnlockDialogOpen(true);
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, bookId, chapterId, book, user]);

  useEffect(() => {
    fetchChapterDetail();
  }, [fetchChapterDetail]);

  const toggleFloatingMenu = () => {
    setFloatingMenuVisible((prev) => !prev);
  };
  const handleChapterListOpen = (event) => {
    if (menuOpen) {
      handleChapterListClose();
    } else {
      setAnchorEl(event.currentTarget);
      setMenuOpen(true);
    }
  };

  const handleChapterListClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleChapterChange = (nextChapterId) => {
    setChapterId(nextChapterId);
    navigate(`/books/${bookId}/chapters/${nextChapterId}`);
  };
  const toggleSideDrawer = useCallback(() => {
    console.log("Toggling Drawer");
    setIsSideDrawerOpen((prev) => !prev);
  }, []);

  const getTagsByIds = (tagIds = []) => {
    if (!Array.isArray(tagIds)) {
      console.warn("Expected tagIds to be an array, but got:", tagIds);
      return [];
    }
    return tags.filter((tag) => tagIds.includes(tag.id));
  };
  const isManga = getTagsByIds(book?.tagIds || []).some((tag) => tag.name.toLowerCase() === "manga");
  const isNovel = getTagsByIds(book?.tagIds || []).some((tag) => tag.name.toLowerCase() === "novel");

  // Check if chapter is locked and not unlocked by user
  const isLocked = chapter?.locked && !chapter?.unlockedByUser && chapter?.price > 0;

  useEffect(() => {
    if (isLocked) {
      console.log("Chapter is locked, opening unlock dialog: ", chapter);
      setUnlockDialogOpen(true);
      setSelectedChapter(chapter);
    }
  }, [isLocked, chapter]);

  const handleUnlock = async () => {
    try {
      if (user && !isTokenExpired(jwt)) {
        await dispatch(unlockChapterAction(chapter.id));
        alert("Chapter unlocked successfully.");
        setUnlockDialogOpen(false);
        // Refresh chapter detail
        fetchChapterDetail();
      } else {
        alert("You need to login to unlock this chapter.");
        navigate("/sign-in");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Failed to unlock chapter.");
    }
  };

  const handleCloseUnlockDialog = () => {
    setUnlockDialogOpen(false);
    navigate(`/books/${bookId}`);
  };

  const handleCloseGeneralError = () => {
    setGeneralError("");
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {isLocked && (
            <Dialog open={unlockDialogOpen} onClose={handleCloseUnlockDialog}>
              <DialogTitle>Unlock Chapter</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  This chapter is locked and requires <strong>{selectedChapter.price} credits</strong> to unlock. Would you like to proceed?
                </DialogContentText>
                {errorMessage && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {errorMessage}
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

          {generalError && (
            <Dialog open={Boolean(generalError)} onClose={handleCloseGeneralError}>
              <DialogTitle>Error</DialogTitle>
              <DialogContent>
                <DialogContentText>{generalError}</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseGeneralError} color="primary" autoFocus>
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          )}

          {!isLocked && (
            <>
              {isManga && (
                <MangaChapterDetail
                  anchorEl={anchorEl}
                  bookId={bookId}
                  chapter={chapter}
                  chapters={chapters}
                  readingProgress={readingProgress}
                  user={user}
                  isFloatingMenuVisible={isFloatingMenuVisible}
                  toggleFloatingMenu={toggleFloatingMenu}
                  handleChapterChange={handleChapterChange}
                  handleChapterListOpen={handleChapterListOpen}
                  handleChapterListClose={handleChapterListClose}
                  onToggleSideDrawer={toggleSideDrawer}
                />
              )}
              {isNovel && (
                <NovelChapterDetail
                  anchorEl={anchorEl}
                  bookId={bookId}
                  chapter={chapter}
                  chapters={chapters}
                  readingProgress={readingProgress}
                  user={user}
                  isFloatingMenuVisible={isFloatingMenuVisible}
                  toggleFloatingMenu={toggleFloatingMenu}
                  handleChapterChange={handleChapterChange}
                  handleChapterListOpen={handleChapterListOpen}
                  handleChapterListClose={handleChapterListClose}
                  onToggleSideDrawer={toggleSideDrawer}
                />
              )}
              {isSideDrawerOpen && (
                <CommentDrawer
                  open={isSideDrawerOpen}
                  user={user}
                  bookId={book.id}
                  chapterId={chapter.id}
                  onToggleDrawer={toggleSideDrawer}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
