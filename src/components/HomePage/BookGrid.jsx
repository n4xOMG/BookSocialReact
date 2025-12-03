import React, { memo } from "react";
import { Grid } from "@mui/material";
import { BookCard } from "./BookCard";

export const BookGrid = memo(({ books, onBookClick, categories, tags }) => {
  if (!books || books.length === 0) return null;

  return (
    <Grid container spacing={3}>
      {books.map((book) => (
        <Grid item xs={6} sm={4} md={3} lg={2.4} key={book.id || book.title}>
          <BookCard 
            book={book} 
            onClick={() => onBookClick(book.id)} 
            categories={categories} 
            tags={tags} 
          />
        </Grid>
      ))}
    </Grid>
  );
});
