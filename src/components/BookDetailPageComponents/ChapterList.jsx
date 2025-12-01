import { MenuBook } from "@mui/icons-material";
import { Box, CircularProgress, Divider, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect } from "react";
import { TabChapters } from "./ChapterListComponent/TabChapters";

export const ChapterList = ({ chapters = [], progresses, onNavigate, bookId, user, onFirstChapterId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Set first chapter id if chapters change
  useEffect(() => {
    if (chapters?.length > 0) {
      onFirstChapterId && onFirstChapterId(chapters[0].id);
    }
    // eslint-disable-next-line
  }, [chapters]);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <MenuBook sx={{ mr: 1.5, color: theme.palette.primary.main }} />
        <Typography
          variant="h5"
          className="font-serif"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          Chapters
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {chapters === undefined ? (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <CircularProgress size={30} thickness={4} color="primary" />
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            Loading chapters...
          </Typography>
        </Box>
      ) : (
        <>
          <TabChapters chapters={chapters} progresses={progresses} onNavigate={onNavigate} bookId={bookId} />

          {chapters?.length === 0 && (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                No chapters available yet. Check back soon!
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
