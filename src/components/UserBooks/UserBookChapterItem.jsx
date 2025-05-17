import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockIcon from "@mui/icons-material/Lock";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Box, Card, CardContent, Chip, IconButton, Tooltip, Typography, useMediaQuery, useTheme, Divider, Stack } from "@mui/material";
import React from "react";

export const UserBookChapterItem = React.memo(({ chapter, onEdit, onDelete, style }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <Box style={style} padding={1}>
      <Card
        sx={{
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "grey.50",
            transform: "translateY(-2px)",
            boxShadow: 2,
          },
          textAlign: "left",
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: "divider",
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
            position: "relative",
          }}
        >
          <Box sx={{ overflow: "hidden", width: "calc(100% - 110px)" }}>
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 0.5 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  color: theme.palette.primary.dark,
                  mr: 1,
                }}
              >
                {isSmallScreen ? `Ch. ${chapter.chapterNum}` : `Chapter ${chapter.chapterNum}: ${chapter.title || "Untitled"}`}
              </Typography>

              <Stack direction="row" spacing={1}>
                {chapter.isPremium && (
                  <Chip
                    size="small"
                    label="Premium"
                    color="secondary"
                    icon={<LockIcon sx={{ fontSize: "0.8rem !important" }} />}
                    sx={{
                      height: 22,
                      fontWeight: 500,
                      fontSize: "0.7rem",
                    }}
                  />
                )}
                {chapter.status === "DRAFT" && (
                  <Chip
                    size="small"
                    label="Draft"
                    color="default"
                    sx={{
                      height: 22,
                      fontWeight: 500,
                      fontSize: "0.7rem",
                    }}
                  />
                )}
              </Stack>
            </Box>

            {chapter.updatedAt && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTimeIcon sx={{ fontSize: "0.9rem", color: "text.secondary", mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  Updated: {formatDate(chapter.updatedAt)}
                </Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              position: { xs: "relative", sm: "absolute" },
              right: { xs: "auto", sm: 16 },
              top: { xs: "auto", sm: "50%" },
              transform: { xs: "none", sm: "translateY(-50%)" },
            }}
          >
            <Tooltip title="View chapter" placement="top">
              <IconButton
                size="small"
                color="info"
                onClick={(event) => {
                  event.stopPropagation();
                  // TODO: Navigate to chapter view page
                }}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: 1,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit chapter" placement="top">
              <IconButton
                size="small"
                color="primary"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(chapter);
                }}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: 1,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete chapter" placement="top">
              <IconButton
                size="small"
                color="error"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(chapter);
                }}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: 1,
                  "&:hover": { bgcolor: "error.lighter" },
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
