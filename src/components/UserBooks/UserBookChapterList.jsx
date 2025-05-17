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
          p: 3,
          borderRadius: 2,
          bgcolor: "background.default",
          border: "1px dashed",
          borderColor: "divider",
        }}
      >
        <MenuBookIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1, color: "text.secondary" }}>
          No Chapters Yet
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Start adding chapters to your book to engage your readers
        </Typography>
        {onAddChapter && (
          <Button variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />} onClick={onAddChapter}>
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
