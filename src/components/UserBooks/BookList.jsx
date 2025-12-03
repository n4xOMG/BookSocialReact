import { Box, List } from "@mui/material";
import { memo } from "react";
import { BookItem } from "./BookItem";

export const BookList = memo(({ books, selectedBookId, onSelectBook, onEditBook, onDeleteBook, lastBookElementRef }) => {
  return (
    <List sx={{ p: 0, width: "100%" }}>
      {books?.map((book, index) => {
        const isLast = index === books.length - 1;
        const isSelected = selectedBookId === book.id;

        return (
          <Box
            ref={isLast ? lastBookElementRef : null}
            key={book.id}
            sx={{ mb: 2 }}
          >
            <BookItem 
              book={book} 
              isSelected={isSelected} 
              onSelect={onSelectBook} 
              onEdit={onEditBook} 
              onDelete={onDeleteBook} 
            />
          </Box>
        );
      })}
    </List>
  );
});
