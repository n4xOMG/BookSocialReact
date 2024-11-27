import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { BookCard } from "./BookCard";
import { CategorySection } from "./CategorySection";

export const MainContent = ({ topCategories, featuredBooks, trendingBooks, categories, tags, checkAuth }) => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", textAlign: "left", position: "relative", py: 4 }}>
      {/* Main Content */}
      <Box component="main" sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
        <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
          {/* Featured Books */}
          <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
            Featured This Week
          </Typography>
          <Grid container spacing={4}>
            {featuredBooks.map((book) => (
              <Grid item key={book.id}>
                <BookCard book={book} categories={categories} tags={tags} checkAuth={checkAuth} />
              </Grid>
            ))}
          </Grid>

          {/* Top 6 Categories */}
          <Typography variant="h4" fontWeight="bold" mt={6} mb={3} textAlign="center">
            Popular Categories
          </Typography>
          <Grid container spacing={4}>
            {topCategories.map((category) => (
              <CategorySection
                key={category.id}
                categories={categories}
                tags={tags}
                category={category.name}
                books={category.books}
                checkAuth={checkAuth}
              />
            ))}
          </Grid>

          {/* Trending Books */}
          <Typography variant="h4" fontWeight="bold" mt={6} mb={3} textAlign="center">
            Trending Now
          </Typography>
          <Grid container spacing={4}>
            {trendingBooks.map((book) => (
              <Grid item key={book.id}>
                <BookCard book={book} categories={categories} tags={tags} checkAuth={checkAuth} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};
