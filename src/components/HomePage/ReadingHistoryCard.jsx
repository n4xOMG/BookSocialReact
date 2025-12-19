import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Box, Card, LinearProgress, Typography, Stack, Skeleton, Chip, alpha, useTheme } from "@mui/material";
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

function formatLastReadDate(dateString) {
  const now = new Date();
  const lastRead = new Date(dateString);
  const diffTime = Math.abs(now - lastRead);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes} min ago`;
    }
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else {
    return lastRead.toLocaleDateString();
  }
}

const ReadingHistoryCard = memo(({ readingProgresses = [] }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  if (readingProgresses.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No reading history yet
        </Typography>
      </Box>
    );
  }

  const sortedProgresses = [...readingProgresses].sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt)).slice(0, 5); // Limit to 5 most recent books

  return (
    <Box sx={{ maxHeight: 150, overflowY: "auto", pr: 1 }}>
      {sortedProgresses.map((progress, index) => (
        <Box
          key={progress.id || index}
          sx={{
            mb: 1.5,
            p: 1.5,
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.2s",
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
          onClick={() => navigate(`/books/${progress.bookId}/chapters/${progress.chapterId}`)}
        >
          <Stack direction="row" spacing={1} alignItems="flex-start">
            {progress.bookCover ? (
              <Box
                component="img"
                src={progress.bookCover.url}
                alt={progress.bookTitle}
                sx={{
                  width: 50,
                  height: 70,
                  borderRadius: 1,
                  objectFit: "cover",
                  flexShrink: 0,
                  boxShadow: 2,
                }}
              />
            ) : (
              <Skeleton variant="rectangular" width={50} height={70} sx={{ borderRadius: 1 }} />
            )}

            <Box sx={{ flex: 1, minWidth: 0,}}>
              <Typography
                variant="body2"
                fontWeight="medium"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {progress.bookTitle}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  textAlign: 'left',
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {progress.bookAuthor}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5}}>
                <AccessTimeIcon sx={{ fontSize: 8, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  {formatLastReadDate(progress.lastReadAt)}
                </Typography>

                {progress.chapterNumber && (
                  <Chip
                    label={`Ch. ${progress.chapterNumber}`}
                    size="small"
                    sx={{
                      height: 16,
                      fontSize: "0.6rem",
                      ml: "auto",
                    }}
                  />
                )}
              </Box>

              <LinearProgress
                variant="determinate"
                value={progress.progress}
                sx={{
                  mt: 1,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
              />
            </Box>
          </Stack>
        </Box>
      ))}

      {readingProgresses.length > 5 && (
        <Box
          sx={{
            textAlign: "center",
            py: 1.5,
            color: "primary.main",
            fontWeight: "medium",
            fontSize: "0.8rem",
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => navigate("/reading-history")}
        >
          View all reading history
        </Box>
      )}
    </Box>
  );
});

export default ReadingHistoryCard;
