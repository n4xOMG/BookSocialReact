import React from "react";
import { Paper, Toolbar, Box, IconButton, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from "@mui/icons-material/Share";

/**
 * Header component for the collaborative editor
 */
export const EditorHeader = ({
  onSaveDraft,
  onPublish,
  onNavigateBack,
  onShare,
  chapterTitle,
  canManageChapter = false,
  isSaving = false,
  isPublishing = false,
}) => {
  const saveDisabled = isSaving;
  const publishDisabled = isPublishing;

  const renderActionButton = ({ label, onClick, variant, color, disabled }) => {
    if (!canManageChapter) {
      return null;
    }

    return (
      <Button variant={variant} color={color} onClick={onClick} sx={{ textTransform: "none" }} disabled={disabled}>
        {label}
      </Button>
    );
  };

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
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {renderActionButton({
            label: isSaving ? "Saving..." : "Save Draft",
            onClick: onSaveDraft,
            variant: "outlined",
            color: "secondary",
            disabled: saveDisabled,
          })}
          {renderActionButton({
            label: isPublishing ? "Publishing..." : "Publish",
            onClick: onPublish,
            variant: "contained",
            color: "primary",
            disabled: publishDisabled,
          })}
          {onShare && (
            <Button variant="text" color="primary" onClick={onShare} startIcon={<ShareIcon />} sx={{ textTransform: "none" }}>
              Share
            </Button>
          )}
        </Box>
      </Toolbar>
    </Paper>
  );
};
