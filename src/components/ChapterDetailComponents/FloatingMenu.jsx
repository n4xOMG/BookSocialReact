import { ChevronLeft, ChevronRight, Fullscreen, Layers, MenuBook } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";
import {
  Box,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import HeightIcon from "@mui/icons-material/Height";
import ChatIcon from "@mui/icons-material/Chat";
import React, { useState } from "react";
const viewModeIcon = {
  single: <Layers />,
  double: <MenuBook />,
  vertical: <HeightIcon />,
};
const themeModeIcon = {
  light: <LightModeIcon />,
  dark: <DarkModeIcon />,
};
export default function FloatingMenu({
  anchorEl,
  currentChapterId,
  open,
  user,
  chapters,
  viewMode,
  themeMode,
  onChapterListOpen,
  onChapterListClose,
  onViewModeChange,
  onThemeModeChange,
  onChapterChange,
  onNavigate,
  onToggleSideDrawer,
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [unlockDialogOpen, setUnlockDialogOpen] = useState(false);
  const [targetChapter, setTargetChapter] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const handleModeChange = (modes, currentMode, onChange) => {
    const currentIndex = modes.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    onChange(modes[nextIndex]);
  };

  const handleViewModeChange = () => {
    const modes = ["single", "vertical"];
    if (!isSmallScreen) modes.push("double");
    handleModeChange(modes, viewMode, onViewModeChange);
  };

  const handleThemeModeChange = () => {
    const modes = ["light", "dark"];
    handleModeChange(modes, themeMode, onThemeModeChange);
  };

  const currentChapterIndex = chapters.findIndex((chapter) => chapter.id === currentChapterId);

  const renderIconButton = (tooltipText, ariaLabel, onClick, icon, disabled = false) => (
    <Tooltip title={<p>{tooltipText}</p>} disableHoverListener={disabled}>
      <span>
        <IconButton
          aria-label={ariaLabel}
          onClick={onClick}
          disabled={disabled}
          sx={{ color: "white", "&.Mui-disabled": { color: "grey" } }}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );

  const handleChapterNavigation = (chapter) => {
    if (chapter.isLocked && !chapter.isUnlockedByUser && chapter.price > 0) {
      setTargetChapter(chapter);
      setUnlockDialogOpen(true);
    } else {
      onChapterChange(chapter.id);
    }
  };

  const handleUnlock = async () => {
    if (!targetChapter) return;
    try {
      await onChapterChange(targetChapter.id);
      setUnlockDialogOpen(false);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Failed to unlock chapter.");
    }
  };

  const handleCloseUnlockDialog = () => {
    setUnlockDialogOpen(false);
    setTargetChapter(null);
    setErrorMessage("");
  };

  return (
    <>
      <Fade in={open}>
        <Box
          sx={{
            position: "fixed",
            bottom: { xs: "20%", sm: "15%", md: "10%", lg: "5%" },
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "#050505",
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            boxShadow: 3,
            p: { xs: 1, sm: 2 },
            display: "flex",
            alignItems: "center",
            gap: 1,
            zIndex: (theme) => theme.zIndex.drawer + 2,
            height: "auto",
          }}
        >
          {renderIconButton(
            "Previous chapter",
            "Previous chapter",
            () => handleChapterNavigation(chapters[currentChapterIndex - 1]),
            <ChevronLeft />,
            currentChapterIndex === 0
          )}

          {renderIconButton("Chapter List", "Chapters list", onChapterListOpen, <ListIcon />)}

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onChapterListClose}>
            {chapters.map((chapter) => (
              <MenuItem
                key={chapter.id}
                onClick={() => {
                  handleChapterNavigation(chapter);
                  onChapterListClose();
                }}
                sx={{ color: "black" }}
              >
                {chapter.chapterNum} {": " + chapter.title}
              </MenuItem>
            ))}
          </Menu>

          {viewMode &&
            renderIconButton(
              `Change view mode (Current: ${viewMode})`,
              `Current view mode: ${viewMode}`,
              handleViewModeChange,
              viewModeIcon[viewMode]
            )}

          {themeMode &&
            renderIconButton(
              `Change theme mode (Current: ${themeMode})`,
              `Current theme: ${themeMode}`,
              handleThemeModeChange,
              themeModeIcon[themeMode]
            )}

          {renderIconButton("Back to book detail page", "Back to Book Page", onNavigate, <HomeIcon />)}

          {renderIconButton("Enter fullscreen mode", "Full Screen", handleFullScreen, <Fullscreen />)}
          {renderIconButton("Comments", "Comments", onToggleSideDrawer, <ChatIcon />)}
          {renderIconButton(
            "Next chapter",
            "Next chapter",
            () => handleChapterNavigation(chapters[currentChapterIndex + 1]),
            <ChevronRight />,
            currentChapterIndex === chapters.length - 1
          )}
        </Box>
      </Fade>

      {/* Confirmation Dialog for Unlocking via Floating Menu */}
      <Dialog open={unlockDialogOpen} onClose={handleCloseUnlockDialog}>
        <DialogTitle>Unlock Chapter</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This chapter is locked and requires <strong>{targetChapter?.price} credits</strong> to unlock. Would you like to proceed?
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
    </>
  );
}
