import { ArrowBack } from "@mui/icons-material";
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";

export default function Headbar({ chapter, onNavigate }) {
  const handleLikeChapter = () => {
    console.log("Like chapter");
  };
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
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Button onClick={handleLikeChapter} sx={{ color: "white" }}>
            Like chapter
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
