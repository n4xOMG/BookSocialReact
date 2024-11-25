import React from "react";
import { FixedSizeList } from "react-window";
import { BookItem } from "./BookItem";

export const BookList = React.memo(({ books, onSelectBook, onEditBook, onDeleteBook }) => (
  <FixedSizeList
    height={600}
    itemCount={books.length}
    itemSize={150}
    width="100%"
    itemData={{ books, onSelectBook, onEditBook, onDeleteBook }}
  >
    {({ index, style, data }) => (
      <BookItem book={data.books[index]} onSelect={data.onSelectBook} onEdit={data.onEditBook} onDelete={data.onDeleteBook} style={style} />
    )}
  </FixedSizeList>
));
