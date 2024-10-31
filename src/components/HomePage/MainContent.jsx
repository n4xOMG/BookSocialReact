import { MenuBook, People, TrendingUp } from "@mui/icons-material";
import { Box, Grid2, IconButton, List, ListItem, Paper, Typography } from "@mui/material";
import React from "react";
import { BookCard } from "./BookCard";
import { CategorySection } from "./CategorySection";
export const MainContent = ({ featuredBooks, booksByCategory, trendingBooks }) => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", textAlign: "left" }}>
      {/* Main Content */}
      <Box component="main" sx={{ pt: 2 }}>
        <Box sx={{ maxWidth: "lg", mx: "auto", p: 3 }}>
          {/* Featured Books */}
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Featured This Week
          </Typography>
          <Grid2 container spacing={3}>
            {featuredBooks.map((book) => (
              <Grid2 item xs={12} md={6} lg={4} key={book.id}>
                <BookCard book={book} />
              </Grid2>
            ))}
          </Grid2>

          <Grid2 container spacing={3} mt={4}>
            {/* Categories */}
            <Grid2 item xs={12} lg={9}>
              <Typography variant="h5" fontWeight="bold" mb={2}>
                Popular Categories
              </Typography>
              <Grid2 container spacing={2}>
                {Object.entries(booksByCategory).map(([category, books]) => (
                  <CategorySection key={category} category={category} books={books} />
                ))}
              </Grid2>
            </Grid2>
            {/* Trending Books */}
            <Grid2 item xs={12} lg={3}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <TrendingUp color="primary" />
                  <Typography variant="h6">Trending Now</Typography>
                </Box>
                <List>
                  {trendingBooks.map((book, index) => (
                    <ListItem key={book.id} sx={{ gap: 2 }}>
                      <Typography variant="h5" color="grey.200" fontWeight="bold" width={20}>
                        {index + 1}
                      </Typography>
                      <Box position="relative">
                        <Box
                          component="img"
                          src={book.cover || featuredBooks[0].cover}
                          alt={book.title}
                          sx={{
                            width: 64,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: 1,
                            transition: "opacity 0.3s",
                            "&:hover": { opacity: 0.9 },
                          }}
                        />
                        <IconButton
                          sx={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "common.white",
                            bgcolor: "rgba(0, 0, 0, 0.4)",
                            opacity: 0,
                            transition: "opacity 0.3s",
                            "&:hover": { opacity: 1 },
                          }}
                        >
                          <MenuBook fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" fontWeight="medium" noWrap>
                          {book.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                          {book.author}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                          <People fontSize="small" />
                          <Typography variant="caption">{book.readers.toLocaleString()} readers</Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </Box>
  );
};
