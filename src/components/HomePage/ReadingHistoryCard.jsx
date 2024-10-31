import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import React from "react";
function ReadingHistoryCard({ readingHistory }) {
  return (
    <Card sx={{ mt: 6, mx: 4, overscrollBehavior: "contain" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <AccessTimeIcon sx={{ mr: 1, fontSize: 16 }} />
          <Typography variant="subtitle2" fontWeight="bold">
            Reading History
          </Typography>
        </Box>
        <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
          {readingHistory.map((book, index) => (
            <Box key={book.id} sx={{ py: 2, px: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                {book.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {book.author}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                Last read: {book.lastRead}
              </Typography>
              {index < readingHistory.length - 1 && <Divider sx={{ mt: 1 }} />}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ReadingHistoryCard;
