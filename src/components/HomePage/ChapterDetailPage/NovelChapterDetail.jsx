import { Backdrop, LinearProgress, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import FloatingMenu from "../../ChapterDetailComponents/FloatingMenu";
import Headbar from "../../ChapterDetailComponents/Headbar";
import LoadingSpinner from "../../LoadingSpinner";
import JsonContentRenderer from "../../common/JsonContentRenderer";
import { saveChapterProgressAction } from "../../../redux/chapter/chapter.action";
import { useAuthCheck } from "../../../utils/useAuthCheck";
import { isValidSlateContent, normalizeSlateContent, convertHtmlToSlateJson } from "../../../utils/JsonContentUtils";
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem("readerThemeMode") || "light";
  });
  const { checkAuth, AuthDialog } = useAuthCheck();

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("readerThemeMode");
    if (savedTheme && savedTheme !== themeMode) {
      setThemeMode(savedTheme);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const saveProgress = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      await dispatch(saveChapterProgressAction(chapter?.id, user.id, progressRef.current));
    } catch (e) {
      console.log("Error in novel chapter detail: ", e);
    } finally {
      setLoading(false);
    }
  }, [dispatch, chapter?.id, user]);
  const debouncedSaveProgress = useMemo(() => debounce(saveProgress, 300), [saveProgress]);

  const handleBackToBookPage = () => {
    saveProgress();
    navigate(-1);
  };

  // Process chapter content - handle both JSON and legacy HTML
  const processedContent = useMemo(() => {
    if (!chapter || !chapter.content) {
      return null;
    }

    // Check if content is already JSON (array)
    if (Array.isArray(chapter.content)) {
      return isValidSlateContent(chapter.content) ? normalizeSlateContent(chapter.content) : null;
    }

    // If content is a string, try to parse as JSON first
    if (typeof chapter.content === "string") {
      try {
        const jsonContent = JSON.parse(chapter.content);
        if (Array.isArray(jsonContent) && isValidSlateContent(jsonContent)) {
          return normalizeSlateContent(jsonContent);
        }
      } catch (e) {
        // Not JSON, treat as HTML and convert
        console.log("Converting HTML content to JSON for chapter:", chapter.id);
        return convertHtmlToSlateJson(chapter.content);
      }
    }

    return null;
  }, [chapter]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const scrollHeight = document.documentElement.scrollHeight;
          const clientHeight = window.innerHeight;
          const newProgress = (scrollTop / (scrollHeight - clientHeight)) * 100;
          progressRef.current = newProgress;
          setProgress(newProgress);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
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
    localStorage.setItem("readerThemeMode", value);
  };

  //blockCopy
  useEffect(() => {
    const blockCopy = (e) => e.preventDefault();

    document.addEventListener("copy", blockCopy);
    document.addEventListener("cut", blockCopy);
    document.addEventListener("contextmenu", blockCopy);

    return () => {
      document.removeEventListener("copy", blockCopy);
      document.removeEventListener("cut", blockCopy);
      document.removeEventListener("contextmenu", blockCopy);
    };
  }, []);

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
            sx={{ 
              flex: 1, 
              p: 3, 
              typography: "body1", 
              lineHeight: 1.75, 
              px: isMobile ? 2 : isTablet ? 10 : 40, 
              //block select
              userSelect: "none", 
              WebkitUserSelect: "none",
              MozUserSelect: "none",
            }}
          >
            {processedContent ? (
              <JsonContentRenderer content={processedContent} themeMode={themeMode} />
            ) : (
              <Box sx={{ textAlign: "center", color: "text.secondary", py: 4 }}>No content available</Box>
            )}
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
