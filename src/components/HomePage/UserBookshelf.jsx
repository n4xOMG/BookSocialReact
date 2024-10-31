import { Book, Bookmark, Search, Sort } from "@mui/icons-material";
import { Avatar, Box, Card, CardContent, CardMedia, Fade, MenuItem, Rating, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
const user = {
  name: "Jane Doe",
  avatar: "/placeholder.svg?height=100&width=100",
  booksRead: 42,
  favoriteGenre: "Science Fiction",
};

const books = [
  {
    id: 1,
    title: "The Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    rating: 5,
    genre: "Science Fiction",
    cover: "/placeholder.svg?height=300&width=200",
  },
  { id: 2, title: "1984", author: "George Orwell", rating: 4, genre: "Dystopian", cover: "/placeholder.svg?height=300&width=200" },
  {
    id: 3,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    rating: 5,
    genre: "Classic",
    cover: "/placeholder.svg?height=300&width=200",
  },
  {
    id: 4,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    rating: 5,
    genre: "Fiction",
    cover: "/placeholder.svg?height=300&width=200",
  },
  {
    id: 5,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    rating: 4,
    genre: "Classic",
    cover: "/placeholder.svg?height=300&width=200",
  },
  { id: 6, title: "Dune", author: "Frank Herbert", rating: 5, genre: "Science Fiction", cover: "/placeholder.svg?height=300&width=200" },
];
export default function UserBookshelf() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredAndSortedBooks = books
    .filter(
      (book) => book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)));

  return (
    <Box sx={{ display: "flex", overscrollBehavior: "contain" }}>
      <Sidebar />
      <Box sx={{ width: "100%", px: 2, mx: "auto", py: 4, minHeight: "100vh", background: "linear-gradient(to right, #f7f7f7, #e0e0e0)" }}>
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between" mb={4} gap={3}>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar src={user.avatar} alt={user.name} sx={{ width: 96, height: 96, border: 2, borderColor: "primary.main" }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                {user.name}'s Bookshelf
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mt={1} color="text.secondary">
                <Box display="flex" alignItems="center" gap={1}>
                  <Book color="primary" />
                  {user.booksRead} books read
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Bookmark color="primary" />
                  {user.favoriteGenre}
                </Box>
              </Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={2} width="100%" maxWidth={400}>
            <TextField
              placeholder="Search books..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search color="action" sx={{ mr: 1 }} />,
              }}
              fullWidth
            />
            <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} variant="outlined" displayEmpty sx={{ width: 150 }}>
              <MenuItem value="asc">
                <Sort /> Sort A-Z
              </MenuItem>
              <MenuItem value="desc">
                <Sort /> Sort Z-A
              </MenuItem>
            </Select>
          </Box>
        </Box>

        {loading ? (
          <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={3}>
            {[...Array(8)].map((_, index) => (
              <Card
                key={index}
                sx={{
                  height: 380,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 3,
                  p: 2,
                  animation: "pulse 1.5s infinite ease-in-out",
                }}
              >
                <CardMedia sx={{ height: 240, backgroundColor: "grey.300" }} />
                <CardContent sx={{ flexGrow: 1, p: 1 }}>
                  <Box sx={{ height: 32, bgcolor: "grey.300", mb: 1, borderRadius: 1 }} />
                  <Box sx={{ height: 20, bgcolor: "grey.300", mb: 1, width: "50%", borderRadius: 1 }} />
                  <Box display="flex" gap={0.5}>
                    {[...Array(5)].map((_, i) => (
                      <Box key={i} sx={{ width: 20, height: 20, bgcolor: "grey.300", borderRadius: "50%" }} />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Fade in={!loading}>
            <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={3}>
              {filteredAndSortedBooks.map((book) => (
                <Card
                  key={book.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: 3,
                    transition: "box-shadow 0.2s",
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  <CardMedia component="img" image={book.cover} alt={`Cover of ${book.title}`} sx={{ height: 240, objectFit: "cover" }} />
                  <CardContent>
                    <Typography variant="h6" fontWeight="medium" color="text.primary" gutterBottom>
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {book.author}
                    </Typography>
                    <Rating value={book.rating} readOnly size="small" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {book.genre}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
}
