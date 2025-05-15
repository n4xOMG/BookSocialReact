import React, { useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { BookItem } from "./BookItem";

export const BookList = React.memo(({ books, selectedBookId, onSelectBook, onEditBook, onDeleteBook }) => {
  const renderRow = useCallback(
    ({ index, style, data }) => (
      <BookItem
        book={data.books[index]}
        isSelected={data.selectedBookId === data.books[index].id}
        onSelect={data.onSelectBook}
        onEdit={data.onEditBook}
        onDelete={data.onDeleteBook}
        style={style}
      />
    ),
    []
  );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          itemCount={books.length}
          itemSize={140}
          width={width}
          itemData={{ books, selectedBookId, onSelectBook, onEditBook, onDeleteBook }}
        >
          {renderRow}
        </List>
      )}
    </AutoSizer>
  );
});
