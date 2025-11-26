import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockIcon from "@mui/icons-material/Lock";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Box, Card, CardContent, Chip, IconButton, Tooltip, Typography, useMediaQuery, useTheme, Divider, Stack } from "@mui/material";
import React from "react";
import { formatExactTime } from "../../utils/formatDate";

export const UserBookChapterItem = React.memo(({ chapter, onEdit, onDelete, style }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box style={style} padding={1}>
      <Card
        elevation={0}
        sx={{
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(0, 201, 167, 0.3)",
            borderColor: "#00c9a7",
          },
          textAlign: "left",
          borderRadius: "16px",
          border: "1px solid",
          borderColor: theme.palette.mode === "dark" ? "rgba(0, 201, 167, 0.2)" : "rgba(0, 201, 167, 0.15)",
          background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
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
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  mr: 1,
                  background: "linear-gradient(135deg, #00c9a7, #56efca)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {isSmallScreen ? `Ch. ${chapter.chapterNum}` : `Chapter ${chapter.chapterNum}: ${chapter.title || "Untitled"}`}
              </Typography>

              <Stack direction="row" spacing={1}>
                {chapter.isPremium && (
                  <Chip
                    size="small"
                    label="Premium"
                    icon={<LockIcon sx={{ fontSize: "0.8rem !important", color: "#fff !important" }} />}
                    sx={{
                      height: 22,
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      color: "#fff",
                      border: "none",
                    }}
                  />
                )}
                {chapter.status === "DRAFT" && (
                  <Chip
                    size="small"
                    label="Draft"
                    sx={{
                      height: 22,
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #ffc107, #ff9800)",
                      color: "#fff",
                      border: "none",
                    }}
                  />
                )}
              </Stack>
            </Box>

            {chapter.updatedAt && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTimeIcon sx={{ fontSize: "0.9rem", color: "text.secondary", mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  Updated: {formatExactTime(chapter.updatedAt)}
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
              background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
              backdropFilter: "blur(12px)",
              borderRadius: "12px",
              p: 0.5,
              border: "1px solid",
              borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
            }}
          >
            <Tooltip title="View chapter" placement="top">
              <IconButton
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  // TODO: Navigate to chapter view page
                }}
                sx={{
                  color: "#9d50bb",
                  "&:hover": {
                    background: "rgba(157, 80, 187, 0.15)",
                  },
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit chapter" placement="top">
              <IconButton
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(chapter);
                }}
                sx={{
                  color: "#00c9a7",
                  "&:hover": {
                    background: "rgba(0, 201, 167, 0.15)",
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete chapter" placement="top">
              <IconButton
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(chapter);
                }}
                sx={{
                  color: "#ff6b6b",
                  "&:hover": {
                    background: "rgba(255, 107, 107, 0.15)",
                  },
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
