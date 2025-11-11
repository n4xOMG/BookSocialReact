import { Box, List } from "@mui/material";
import { memo } from "react";
import { BookItem } from "./BookItem";

export const BookList = memo(({ books, selectedBookId, onSelectBook, onEditBook, onDeleteBook, lastBookElementRef }) => {
  return (
    <List
      sx={{
        overflow: "auto",
        height: "100%",
        padding: 0,
        "&::-webkit-scrollbar": {
          width: 8,
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: 4,
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#999",
        },
      }}
    >
      {books?.map((book, index) => {
        const isLast = index === books.length - 1;
        const isSelected = selectedBookId === book.id;

        return (
          <Box
            ref={isLast ? lastBookElementRef : null}
            key={book.id}
            sx={{
              mb: isLast ? 0 : 2,
            }}
          >
            <BookItem book={book} isSelected={isSelected} onSelect={onSelectBook} onEdit={onEditBook} onDelete={onDeleteBook} />
          </Box>
        );
      })}
    </List>
  );
});
