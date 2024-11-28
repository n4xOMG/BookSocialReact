import { Box, Typography, Chip, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const BookDetails = ({ book, categories, tags }) => {
  const navigate = useNavigate();

  // Helper functions to get category and tag names
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "N/A";
  };

  const getTagNames = (tagIds) => {
    return tags.filter((tag) => tagIds.includes(tag.id)).map((tag) => tag.name);
  };

  return (
    <>
      <Typography variant="h3" sx={{ mb: 2, textAlign: "left" }}>
        {book.title}
      </Typography>
      <Typography sx={{ color: "gray.600", mb: 4, textAlign: "left" }}>
        By{" "}
        <Box
          component="span"
          sx={{
            fontWeight: "bold",
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={() => navigate(`/profile/${book.author.id}`)}
        >
          {book.authorName}
        </Box>{" "}
        • Illustrated by{" "}
        <Box component="span" sx={{ fontWeight: "bold" }}>
          {book.artistName}
        </Box>
      </Typography>
      <Typography sx={{ color: "gray.700", mb: 6, textAlign: "left" }}>{book.description}</Typography>

      {/* Additional Details */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Chip label={`Category: ${getCategoryName(book.categoryId)}`} />
        <Chip label={`Status: ${book.status}`} />
        {getTagNames(book.tagIds).map((tag) => (
          <Chip key={tag} label={tag} color="primary" />
        ))}
      </Stack>
    </>
  );
};
