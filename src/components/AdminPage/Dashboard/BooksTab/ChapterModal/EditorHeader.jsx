import React from "react";
import { Paper, Toolbar, Box, IconButton, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/**
 * Header component for the collaborative editor
 */
export const EditorHeader = ({ onSaveDraft, onPublish, onNavigateBack, chapterTitle }) => {
  return (
    <Paper elevation={2} sx={{ mb: 2 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "background.paper",
          padding: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={onNavigateBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
            {chapterTitle || "Untitled Chapter"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" color="secondary" onClick={onSaveDraft} sx={{ textTransform: "none" }}>
            Save Draft
          </Button>
          <Button variant="contained" color="primary" onClick={onPublish} sx={{ textTransform: "none" }}>
            Publish
          </Button>
        </Box>
      </Toolbar>
    </Paper>
  );
};
