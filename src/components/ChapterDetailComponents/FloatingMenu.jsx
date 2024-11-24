import { ChevronLeft, ChevronRight, Fullscreen, Layers, MenuBook } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";
import { Box, Fade, IconButton, Menu, MenuItem, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import HeightIcon from "@mui/icons-material/Height";
import ChatIcon from "@mui/icons-material/Chat";
import React from "react";
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

  return (
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
          () => onChapterChange(chapters[currentChapterIndex - 1].id),
          <ChevronLeft />,
          currentChapterIndex === 0
        )}

        {renderIconButton("Chapter List", "Chapters list", onChapterListOpen, <ListIcon />)}

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onChapterListClose}>
          {chapters.map((chapter) => (
            <MenuItem
              key={chapter.id}
              onClick={() => {
                onChapterChange(chapter.id);
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
          () => onChapterChange(chapters[currentChapterIndex + 1].id),
          <ChevronRight />,
          currentChapterIndex === chapters.length - 1
        )}
      </Box>
    </Fade>
  );
}
