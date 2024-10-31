import { MenuBook } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
export function BookCard({ book }) {
  return (
    <Box
      sx={{
        width: 200, // Fixed width
        height: 350, // Fixed height
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: 1,
        overflow: "hidden",
        transition: "box-shadow 0.3s",
        textAlign: "left",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <Box sx={{ position: "relative", height: 192 }}>
        {" "}
        {/* Fixed image height */}
        <Box
          component="img"
          src={book.cover}
          alt={`${book.title} cover`}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.3s",
            "&:hover": { opacity: 0.9 },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            opacity: 0,
            transition: "opacity 0.3s",
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&:hover": { backgroundColor: "primary.dark" },
            ".MuiBox-root:hover &": { opacity: 1 },
          }}
        >
          <MenuBook fontSize="small" />
          <Typography variant="button" color="inherit">
            Read Now
          </Typography>
        </Button>
      </Box>
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          component="h3"
          noWrap
          sx={{
            mb: 0.5,
            maxWidth: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
          {book.author}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography variant="body2" sx={{ color: "warning.main" }}>
            {"★".repeat(book.rating)}
            {"☆".repeat(5 - book.rating)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({book.reviews.toLocaleString()} reviews)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
