import { Backdrop, Box, useTheme } from "@mui/material";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../LoadingSpinner";
import { saveChapterProgressAction } from "../../../redux/chapter/chapter.action";
import FloatingMenu from "../../ChapterDetailComponents/FloatingMenu";
import MangaPageContent from "../../ChapterDetailComponents/MangaChapterDetail/MangaPageContent";
import Headbar from "../../ChapterDetailComponents/Headbar";
import MangaPageNavigation from "../../ChapterDetailComponents/MangaChapterDetail/MangaPageNavigation";
import { useAuthCheck } from "../../../utils/useAuthCheck";

export default function MangaChapterDetail({
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
  onToggleSideDrawer,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [hoverZone, setHoverZone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialPageSet, setInitialPageSet] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("viewMode") || "single";
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const totalPages = Math.max((chapter?.content.match(/<img/g) || []).length, 1);
  const { checkAuth, AuthDialog } = useAuthCheck();
  useEffect(() => {
    setLoading(true);
    if (!initialPageSet && readingProgress && !isNaN(readingProgress.progress) && totalPages > 0) {
      // Calculate initialPage using Math.ceil to better align with user progress
      let initialPage = Math.ceil((readingProgress.progress / 100) * totalPages) - 1;

      // Ensure initialPage is within valid bounds [0, totalPages - 1]
      initialPage = Math.max(0, Math.min(initialPage, totalPages - 1));

      setCurrentPage(initialPage);
      setInitialPageSet(true);
    }
    setLoading(false);
  }, [readingProgress, totalPages, initialPageSet]);

  const saveProgress = useCallback(async () => {
    setLoading(true);
    if (!user) return;

    let progress = 0;
    if (viewMode === "double") {
      const pagesRead = Math.ceil((currentPage + 1) / 2);
      const totalFlipPages = Math.ceil(totalPages / 2);

      if (totalFlipPages > 1) {
        progress = (pagesRead / totalFlipPages) * 100;
        if (pagesRead >= totalFlipPages) progress = 100;
      } else if (totalFlipPages === 1) {
        progress = 100;
      }
    } else {
      progress = ((currentPage + 1) / totalPages) * 100;
      if (currentPage + 1 >= totalPages) progress = 100;
    }

    await dispatch(saveChapterProgressAction(bookId, chapter?.id, user.id, progress));
    setLoading(false);
  }, [dispatch, bookId, chapter?.id, user, currentPage, totalPages, viewMode]);

  const debouncedSaveProgress = useMemo(() => debounce(saveProgress, 300), [saveProgress]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      debouncedSaveProgress();
      event.preventDefault();
      event.returnValue = "";
    };

    const handleNavigation = () => {
      debouncedSaveProgress();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleNavigation);
    };
  }, [debouncedSaveProgress]);

  const handlePageChange = (newPage) => {
    const newCurrentPage = Math.max(0, Math.min(newPage, totalPages - 1));
    setCurrentPage(newCurrentPage);
  };

  const handleViewModeChange = (value) => {
    setViewMode(value);
    localStorage.setItem("viewMode", value);
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (viewMode === "double") {
        if (e.key === "ArrowLeft") {
          handlePageChange(currentPage - 2);
        } else if (e.key === "ArrowRight") {
          handlePageChange(currentPage + 2);
        }
      } else {
        if (e.key === "ArrowLeft") {
          handlePageChange(currentPage - 1);
        } else if (e.key === "ArrowRight") {
          handlePageChange(currentPage + 1);
        }
      }
    },
    [currentPage, viewMode]
  );
  const handleBackToBookPage = () => {
    saveProgress();
    navigate(`/books/${bookId}`);
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box
          sx={{
            position: "relative",
            maxWidth: "100%",
            maxHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {chapter && (
            <>
              <MangaPageContent
                chapter={chapter}
                viewMode={viewMode}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                hoverZone={hoverZone}
                setHoverZone={setHoverZone}
                toggleFloatingMenu={toggleFloatingMenu}
                readingProgress={readingProgress}
              />
            </>
          )}

          {isFloatingMenuVisible && (
            <>
              <Backdrop
                sx={{ color: "#fff", zIndex: theme.zIndex.drawer + 1, bgcolor: "rgba(0, 0, 0, 0.5)" }}
                open={isFloatingMenuVisible}
                onClick={toggleFloatingMenu}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  zIndex: theme.zIndex.drawer + 2,
                }}
              >
                <Headbar chapter={chapter} onNavigate={handleBackToBookPage} checkAuth={checkAuth} />
                <FloatingMenu
                  anchorEl={anchorEl}
                  bookId={bookId}
                  currentChapterId={chapter?.id}
                  chapters={chapters}
                  open={isFloatingMenuVisible}
                  viewMode={viewMode}
                  onNavigate={handleBackToBookPage}
                  onChapterListOpen={handleChapterListOpen}
                  onChapterListClose={handleChapterListClose}
                  onViewModeChange={handleViewModeChange}
                  onChapterChange={handleChapterChange}
                  onToggleSideDrawer={onToggleSideDrawer}
                />
                <MangaPageNavigation
                  totalPages={totalPages}
                  viewMode={viewMode}
                  currentPage={currentPage}
                  handlePageChange={handlePageChange}
                />
              </Box>
            </>
          )}
        </Box>
      )}
      <AuthDialog />
    </>
  );
}
