import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockIcon from "@mui/icons-material/Lock";
import { Box, Card, CardContent, Chip, IconButton, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";

export const UserBookChapterItem = React.memo(({ chapter, onEdit, onDelete, style }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box style={style} padding={1}>
      <Card
        sx={{
          transition: "all 0.2s",
          "&:hover": {
            bgcolor: "grey.100",
            transform: "translateY(-2px)",
            boxShadow: 2,
          },
          textAlign: "left",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            "&:last-child": {
              pb: 2,
            },
          }}
        >
          <Box sx={{ overflow: "hidden" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "medium",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {isSmallScreen ? `Ch. ${chapter.chapterNum}` : `Chapter ${chapter.chapterNum}: ${chapter.title || "Untitled"}`}
              </Typography>
              {chapter.isPremium && (
                <Chip size="small" label="Premium" color="secondary" icon={<LockIcon fontSize="small" />} sx={{ height: 24 }} />
              )}
              {chapter.status === "DRAFT" && <Chip size="small" label="Draft" color="default" sx={{ height: 24 }} />}
            </Box>
            {!isSmallScreen && chapter.updatedAt && (
              <Typography variant="caption" color="text.secondary">
                Last updated: {new Date(chapter.updatedAt).toLocaleDateString()}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="View chapter">
              <IconButton
                size="small"
                color="primary"
                onClick={(event) => {
                  event.stopPropagation();
                  // TODO: Navigate to chapter view page
                }}
                sx={{ mr: 0.5 }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit chapter">
              <IconButton
                size="small"
                color="primary"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(chapter);
                }}
                sx={{ mr: 0.5 }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete chapter">
              <IconButton
                size="small"
                color="error"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(chapter);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
});
