import { MenuBook } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";

export function CategorySection({ category, books }) {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        p: 2,
        borderRadius: "8px",
        boxShadow: 1,
        transition: "box-shadow 0.3s",
        textAlign: "left",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <Typography variant="h6" component="h3" sx={{ fontWeight: "medium", mb: 2 }}>
        {category}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {books.map((book) => (
          <Box key={book.id} sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%", height: 120 }}>
            <Box sx={{ position: "relative", width: 64, height: 80 }}>
              <Box
                component="img"
                src={book.cover}
                alt={book.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
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
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  opacity: 0,
                  transition: "opacity 0.3s",
                  "&:hover": { opacity: 1 },
                }}
              >
                <MenuBook fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: "medium", lineClamp: 1, mb: 0.5 }}>
                {book.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                {book.author}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
