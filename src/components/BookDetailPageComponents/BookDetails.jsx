import { Box, Typography } from "@mui/material";

export const BookDetails = ({ book }) => (
  <>
    <Typography variant="h3" sx={{ mb: 2, textAlign: "left" }}>
      {book.title}
    </Typography>
    <Typography sx={{ color: "gray.600", mb: 4, textAlign: "left" }}>
      By{" "}
      <Box component="span" sx={{ fontWeight: "bold" }}>
        {book.authorName}
      </Box>{" "}
      • Illustrated by{" "}
      <Box component="span" sx={{ fontWeight: "bold" }}>
        {book.artistName}
      </Box>
    </Typography>
    <Typography sx={{ color: "gray.700", mb: 6, textAlign: "left" }}>{book.description}</Typography>
  </>
);
