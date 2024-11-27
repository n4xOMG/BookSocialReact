import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Box, Card, CardContent, Divider, LinearProgress, Typography } from "@mui/material";
import React from "react";
function ReadingHistoryCard({ readingProgresses }) {
  return (
    <Card sx={{ mt: 6, mx: 2, textAlign: "left", overscrollBehavior: "contain" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <AccessTimeIcon sx={{ mr: 1, fontSize: 16 }} />
          <Typography variant="subtitle2" fontWeight="bold">
            Reading History
          </Typography>
        </Box>
        <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
          {readingProgresses
            ?.sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt))
            .map((progress, index) => (
              <Box key={progress.id} sx={{ py: 2, px: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  {progress.bookTitle}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {progress.bookAuthor}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                  Last read: {new Date(progress.lastReadAt).toLocaleDateString()}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress.progress}
                  sx={{
                    "& .MuiLinearProgress-root": {
                      backgroundColor: "gray",
                    },
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "black",
                    },
                  }}
                />
                {index < readingProgresses.length - 1 && <Divider sx={{ mt: 1 }} />}
              </Box>
            ))}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ReadingHistoryCard;
