import React, { useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { UserBookChapterItem } from "./UserBookChapterItem";

export const UserBookChapterList = React.memo(({ chapters, onEditChapter, onDeleteChapter }) => {
  const renderRow = useCallback(
    ({ index, style, data }) => (
      <UserBookChapterItem chapter={data.chapters[index]} onEdit={data.onEditChapter} onDelete={data.onDeleteChapter} style={style} />
    ),
    []
  );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          itemCount={chapters.length}
          itemSize={70}
          width={width}
          itemData={{ chapters, onEditChapter, onDeleteChapter }}
        >
          {renderRow}
        </List>
      )}
    </AutoSizer>
  );
});
