import React, { useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { UserBookChapterItem } from "./UserBookChapterItem";
import { Box } from "@mui/material";

export const UserBookChapterList = React.memo(({ chapters, onEditChapter, onDeleteChapter }) => {
  const renderRow = useCallback(
    ({ index, style, data }) => (
      <UserBookChapterItem 
        chapter={data.chapters[index]} 
        onEdit={data.onEditChapter} 
        onDelete={data.onDeleteChapter} 
        style={style} 
      />
    ),
    []
  );

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={chapters.length}
            itemSize={72}
            width={width}
            itemData={{ chapters, onEditChapter, onDeleteChapter }}
            overscanCount={5}
          >
            {renderRow}
          </List>
        )}
      </AutoSizer>
    </Box>
  );
});
