import { useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { BookCard } from "../HomePage/BookCard";

const RelatedBooks = ({ relatedBooks, loading, categories, tags }) => {
  const scrollRef = useRef(null);

  if (loading) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6">Loading related books...</Typography>
      </Box>
    );
  }

  if (!relatedBooks || relatedBooks.length === 0) {
    return null;
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -220 : 220, // số px để cuộn
        behavior: "smooth",
      });
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Related Books You Might Enjoy
      </Typography>

      {/* Nút trái */}
      <IconButton
        onClick={() => scroll("left")}
        sx={{
          position: "absolute",
          top: "50%",
          left: -10,
          transform: "translateY(-50%)",
          zIndex: 2,
          bgcolor: "action.notselect",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <ArrowBackIos />
      </IconButton>

      {/* List sách */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          scrollBehavior: "smooth",
          pb: 1,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {relatedBooks.map((book) => (
          <Box
            key={book.id}
            sx={{ flex: "0 0 180px", maxWidth: 180 }}
          >
            <BookCard
              book={book}
              categories={categories}
              tags={tags}
              showRating={false}
              showActions={false}
            />
          </Box>
        ))}
      </Box>

      {/* Nút phải */}
      <IconButton
        onClick={() => scroll("right")}
        sx={{
          position: "absolute",
          top: "50%",
          right: -10,
          transform: "translateY(-50%)",
          zIndex: 2,
          bgcolor: "action.notselect",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
};

export default RelatedBooks;
