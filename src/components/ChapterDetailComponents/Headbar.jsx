import { ArrowBack, Favorite, FavoriteBorder } from "@mui/icons-material";
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";
import { likeChapterAction, unlikeChapterAction } from "../../redux/chapter/chapter.action";
import { useDispatch } from "react-redux";

export default function Headbar({ chapter, onNavigate, checkAuth }) {
  const dispatch = useDispatch();
  const handleLikeChapter = checkAuth(() => {
    if (chapter?.likedByCurrentUser) {
      dispatch(unlikeChapterAction(chapter.id));
    } else {
      dispatch(likeChapterAction(chapter.id));
    }
  });
  return (
    <AppBar
      position="static"
      sx={{ position: "fixed", bgcolor: "#050505", opacity: "90%", borderBottom: 1, borderColor: "divider", top: 0 }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton sx={{ color: "white" }} edge="start" aria-label="go back" onClick={onNavigate}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" }, color: "white" }}>
            Book Social
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)", color: "white" }}>
          Ch.{chapter.chapterNum}: {chapter.title}
        </Typography>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, alignItems: "center" }}>
          <Button onClick={handleLikeChapter} sx={{ color: "white" }}>
            {chapter?.likedByCurrentUser ? <Favorite /> : <FavoriteBorder />}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
