import { Book, Search } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardContent, CardMedia, Fade, Rating, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserFavouredBooksAction } from "../../redux/book/book.action";

export default function UserBookshelf() {
  const { user } = useSelector((store) => store.auth);
  const { userFavouredBooks, userFavouredBooksHasMore = true } = useSelector((store) => store.book);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const size = 12;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch books on mount changes
  useEffect(() => {
    setLoading(true);
    setPage(0);
    dispatch(getUserFavouredBooksAction({ page: 0, size })).finally(() => setLoading(false));
  }, [dispatch]);

  // Load more handler
  const handleLoadMore = useCallback(() => {
    setLoading(true);
    dispatch(getUserFavouredBooksAction({ page: page + 1, size })).finally(() => {
      setPage((prev) => prev + 1);
      setLoading(false);
    });
  }, [dispatch, page]);

  // Memoize filtered and sorted books
  const filteredAndSortedBooks = useMemo(() => {
    return (userFavouredBooks || []).filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.authorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [userFavouredBooks, searchTerm]);


  return (
    <Box sx={{ display: "flex", overscrollBehavior: "contain" }}>
      <Box sx={{ width: "100%", px: 2, mx: "auto", py: 4, minHeight: "100%" }}>
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between" mb={4} gap={3}>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar src={user?.avatarUrl} alt={user?.username} sx={{ width: 96, height: 96, border: 2, borderColor: "primary.main" }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                {user?.username}'s Bookshelf
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mt={1} color="text.secondary">
                <Box display="flex" alignItems="center" gap={1}>
                  <Book color="primary" />
                  {userFavouredBooks?.length || 0} favourited books
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
          </Box>
        </Box>

        {loading && page === 0 ? (
          <Box 
            display="grid" 
            sx={{ 
              gap: 3, 
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(250px, 1fr))",
            }}
          >
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
            <Box>
              <Box 
                display="grid" 
                sx={{ 
                  gap: 3, 
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(250px, 1fr))",
                }}
              >
                {filteredAndSortedBooks.map((book) => (
                  <Card
                    onClick={() => navigate(`/books/${book.id}`)}
                    key={book.id}
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "row" : "column",
                      boxShadow: 3,
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: 6 },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={book.bookCover.url}
                      alt={`Cover of ${book.title}`}
                      sx={{ 
                        height: isMobile ? 137 : 240,
                        width: isMobile ? 90 : "100%", 
                        objectFit: "cover",
                        flexShrink: 0, 
                      }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        p: isMobile ? 3 : 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="medium"
                        color="text.primary"
                        gutterBottom
                        sx={{
                          maxWidth: "220px",
                          width: "100%",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {book.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                        sx={{
                          maxWidth: "220px",
                          width: "100%",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {book.authorName}
                      </Typography>
                      <Rating value={book.avgRating} readOnly size="small" sx={{ mb: 1 }} />
                    </CardContent>
                  </Card>
                ))}
              </Box>
              {userFavouredBooksHasMore && filteredAndSortedBooks.length > 0 && (
                <Box display="flex" justifyContent="center" mt={3}>
                  <Button variant="contained" onClick={handleLoadMore} disabled={loading}>
                    {loading ? "Loading..." : "Load More"}
                  </Button>
                </Box>
              )}
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
}
