import React from "react";
import { Box, Card, CardContent, CardMedia, IconButton, Typography, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const BookItem = React.memo(({ book, isSelected, onSelect, onEdit, onDelete, style }) => {
  const theme = useTheme();

  return (
    <Box style={style} padding={1}>
      <Card
        onClick={() => onSelect(book.id)}
        sx={{
          display: "flex",
          height: "120px",
          transition: "all 0.2s ease-in-out",
          border: isSelected ? `2px solid ${theme.palette.primary.main}` : "none",
          boxShadow: isSelected ? 3 : 1,
          "&:hover": {
            boxShadow: 4,
            bgcolor: "grey.100",
          },
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: 80, objectFit: "cover" }}
          image={book.bookCover || "https://via.placeholder.com/80x120?text=No+Cover"}
          alt={book.title}
        />
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <CardContent sx={{ flex: "1 0 auto", p: 2, "&:last-child": { pb: 2 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box sx={{ overflow: "hidden", mr: 1 }}>
                <Typography
                  variant="subtitle1"
                  component="div"
                  sx={{ fontWeight: "bold", mb: 0.5, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                >
                  {book.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    mb: 1,
                  }}
                >
                  {book.description || "No description available"}
                </Typography>
              </Box>
              <Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(book);
                  }}
                  sx={{
                    color: "action.active",
                    p: 0.5,
                    mr: 0.5,
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(book);
                  }}
                  sx={{
                    color: "error.main",
                    p: 0.5,
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            {book.status && (
              <Box
                sx={{
                  display: "inline-block",
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  bgcolor: book.status === "COMPLETED" ? "success.light" : "info.light",
                  color: book.status === "COMPLETED" ? "success.contrastText" : "info.contrastText",
                  fontSize: "0.75rem",
                }}
              >
                {book.status}
              </Box>
            )}
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
});
