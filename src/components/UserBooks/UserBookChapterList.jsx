import React, { useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { UserBookChapterItem } from "./UserBookChapterItem";
import { Box, Typography, Button, Paper } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export const UserBookChapterList = React.memo(({ chapters, onEditChapter, onDeleteChapter, onAddChapter }) => {
  const renderRow = useCallback(
    ({ index, style, data }) => (
      <UserBookChapterItem chapter={data.chapters[index]} onEdit={data.onEditChapter} onDelete={data.onDeleteChapter} style={style} />
    ),
    []
  );

  // Handle empty chapter list
  if (!chapters || chapters.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          p: 4,
          borderRadius: "24px",
          background: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.6)"),
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(0, 201, 167, 0.2)" : "rgba(0, 201, 167, 0.15)"),
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "20px",
            background: "linear-gradient(135deg, #00c9a7, #56efca)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2.5,
            boxShadow: "0 8px 24px rgba(0, 201, 167, 0.3)",
          }}
        >
          <MenuBookIcon sx={{ fontSize: 48, color: "#fff" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            fontSize: "1.5rem",
            background: "linear-gradient(135deg, #00c9a7, #56efca)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          No Chapters Yet
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3, lineHeight: 1.6, maxWidth: 300 }}>
          Start adding chapters to your book to engage your readers
        </Typography>
        {onAddChapter && (
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={onAddChapter}
            sx={{
              borderRadius: "10px",
              background: "linear-gradient(135deg, #00c9a7, #56efca)",
              color: "#fff",
              fontWeight: 700,
              textTransform: "none",
              px: 3,
              py: 1,
              boxShadow: "0 4px 16px rgba(0, 201, 167, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #56efca, #84fab0)",
                boxShadow: "0 6px 24px rgba(0, 201, 167, 0.5)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Add First Chapter
          </Button>
        )}
      </Paper>
    );
  }

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={chapters.length}
            itemSize={85} // Increased for better spacing
            width={width}
            itemData={{ chapters, onEditChapter, onDeleteChapter }}
            overscanCount={2} // For better scrolling performance
          >
            {renderRow}
          </List>
        )}
      </AutoSizer>
    </Box>
  );
});
