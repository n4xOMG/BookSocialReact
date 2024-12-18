import { Backdrop, LinearProgress, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { debounce } from "lodash";
import parse from "html-react-parser";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import FloatingMenu from "../../ChapterDetailComponents/FloatingMenu";
import Headbar from "../../ChapterDetailComponents/Headbar";
import LoadingSpinner from "../../LoadingSpinner";
import { saveChapterProgressAction } from "../../../redux/chapter/chapter.action";
import { useAuthCheck } from "../../../utils/useAuthCheck";
export default function NovelChapterDetail({
  anchorEl,
  bookId,
  chapter,
  chapters,
  user,
  readingProgress,
  isFloatingMenuVisible,
  toggleFloatingMenu,
  handleChapterChange,
  handleChapterListOpen,
  handleChapterListClose,
  onToggleSideDrawer,
}) {
  const [progress, setProgress] = useState(readingProgress ? readingProgress.progress : 0);
  const [loading, setLoading] = useState(false);
  const progressRef = useRef(progress);
  const contentRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem("themeMode") || "light";
  });
  const { checkAuth, AuthDialog } = useAuthCheck();
  const saveProgress = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      await dispatch(saveChapterProgressAction(bookId, chapter?.id, user.id, progressRef.current));
    } catch (e) {
      console.log("Error in novel chapter detail: ", e);
    } finally {
      setLoading(false);
    }
  }, [dispatch, bookId, chapter?.id, user]);
  const debouncedSaveProgress = useMemo(() => debounce(saveProgress, 300), [saveProgress]);

  const handleBackToBookPage = () => {
    saveProgress();
    navigate(`/books/${bookId}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const newProgress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      progressRef.current = newProgress;
      setProgress(newProgress);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    if (readingProgress) {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollTop = (readingProgress.progress / 100) * (scrollHeight - clientHeight);
      window.scrollTo(0, scrollTop);
    }
  }, [readingProgress]);
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
  const handleThemeModeChange = (value) => {
    setThemeMode(value);
    localStorage.setItem("themeMode", value);
  };
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            bgcolor: themeMode === "light" ? "#fdf6e3" : "#212121",
          }}
        >
          <Box
            onClick={toggleFloatingMenu}
            ref={contentRef}
            sx={{ flex: 1, p: 3, typography: "body1", lineHeight: 1.75, px: isSmallScreen ? 2 : 10 }}
          >
            <Box
              sx={{
                color: themeMode === "light" ? "#242424" : "white",
                "& p": {
                  marginBottom: "1em",
                },
                "& strong": {
                  fontWeight: "bold",
                },
                "& em": {
                  fontStyle: "italic",
                },
                "& u": {
                  textDecoration: "underline",
                },
                "& a": {
                  color: "#1e90ff",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                },
                "& img": {
                  maxWidth: "100%",
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                },
                "& blockquote": {
                  borderLeft: "4px solid #ccc",
                  paddingLeft: "1em",
                  color: "#666",
                  fontStyle: "italic",
                },
              }}
            >
              {chapter && chapter.content ? parse(chapter?.content) : "No content"}
            </Box>
          </Box>
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
                  themeMode={themeMode}
                  onNavigate={handleBackToBookPage}
                  onThemeModeChange={handleThemeModeChange}
                  onChapterListOpen={handleChapterListOpen}
                  onChapterListClose={handleChapterListClose}
                  onChapterChange={handleChapterChange}
                  onToggleSideDrawer={onToggleSideDrawer}
                />
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    position: "fixed",
                    bottom: "0%",
                    width: "100%",
                  }}
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
