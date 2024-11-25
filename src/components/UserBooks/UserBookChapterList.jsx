import React from "react";
import { UserBookChapterItem } from "./UserBookChapterItem";
import { FixedSizeList } from "react-window";

export const UserBookChapterList = React.memo(({ chapters, onEditChapter, onDeleteChapter }) => (
  <FixedSizeList
    height={400}
    itemCount={chapters.length}
    itemSize={80}
    width="100%"
    itemData={{ chapters, onEditChapter, onDeleteChapter }}
  >
    {({ index, style, data }) => (
      <UserBookChapterItem chapter={data.chapters[index]} onEdit={data.onEditChapter} onDelete={data.onDeleteChapter} style={style} />
    )}
  </FixedSizeList>
));
