import { Grid, Typography } from "@mui/material";
import React from "react";
import { BookCard } from "./BookCard";

export function CategorySection({ category, books }) {
  return (
    <Grid item xs={12}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        {category}
      </Typography>
      <Grid container spacing={4}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <BookCard book={book} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
