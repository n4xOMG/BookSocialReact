import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LabelIcon from "@mui/icons-material/Label";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import StarIcon from "@mui/icons-material/Star";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Card, CardContent, CardMedia, Chip, Divider, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import React from "react";

export const BookItem = React.memo(({ book, isSelected, onSelect, onEdit, onDelete, style }) => {
  const theme = useTheme();

  return (
    <Box style={style} padding={1}>
      <Card
        onClick={() => onSelect(book.id)}
        elevation={isSelected ? 3 : 1}
        sx={{
          display: "flex",
          height: "160px",
          transition: "all 0.2s ease-in-out",
          border: isSelected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          position: "relative",
          "&:hover": {
            boxShadow: 4,
            transform: "translateY(-3px)",
          },
          cursor: "pointer",
          overflow: "hidden",
          bgcolor: isSelected ? "action.selected" : "background.paper",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: 110,
            objectFit: "cover",
            boxShadow: 2,
            borderRadius: "4px 0 0 4px",
          }}
          image={book.bookCover || "https://via.placeholder.com/110x160?text=No+Cover"}
          alt={book.title}
        />
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <CardContent sx={{ flex: "1 0 auto", p: 2, "&:last-child": { pb: 1 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box sx={{ overflow: "hidden", mr: 1, width: "calc(100% - 60px)", maxWidth: "100%" }}>
                <Tooltip title={book.title} placement="top" arrow>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontWeight: 600,
                      mb: 0.75,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      color: theme.palette.primary.dark,
                      maxWidth: "100%",
                    }}
                  >
                    {book.title}
                  </Typography>
                </Tooltip>
                <Box sx={{ position: "relative", height: "40px", overflow: "hidden" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      mb: 1.5,
                      lineHeight: 1.4,
                      maxWidth: "100%",
                    }}
                  >
                    {book.description || "No description available"}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  position: "absolute",
                  top: 8,
                  right: 8,
                  opacity: isSelected ? 1 : 0,
                  transition: "opacity 0.2s ease-in-out",
                  ".MuiCard-root:hover &": { opacity: 1 },
                }}
              >
                <Tooltip title="Edit book" placement="top">
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
                      bgcolor: "background.paper",
                      boxShadow: 1,
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete book" placement="top">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(book);
                    }}
                    sx={{
                      color: "error.main",
                      p: 0.5,
                      bgcolor: "background.paper",
                      boxShadow: 1,
                      "&:hover": {
                        bgcolor: "error.lighter",
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 0.5 }}>
                {book.status && (
                  <Chip
                    label={book.status}
                    size="small"
                    color={book.status === "COMPLETED" ? "success" : "info"}
                    sx={{
                      height: "22px",
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      maxWidth: "100px",
                      "& .MuiChip-label": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    }}
                  />
                )}

                {book.chapterCount > 0 && (
                  <Tooltip title="Chapters">
                    <Chip
                      icon={<LibraryBooksIcon sx={{ fontSize: "0.9rem !important" }} />}
                      label={`${book.chapterCount}`}
                      size="small"
                      variant="outlined"
                      sx={{ height: "22px", fontSize: "0.7rem" }}
                    />
                  </Tooltip>
                )}

                {book.tagIds?.length > 0 && (
                  <Tooltip title={`${book.tagIds.length} ${book.tagIds.length === 1 ? "tag" : "tags"}`}>
                    <Chip
                      icon={<LabelIcon sx={{ fontSize: "0.9rem !important" }} />}
                      label={book.tagIds.length}
                      size="small"
                      variant="outlined"
                      sx={{ height: "22px", fontSize: "0.7rem" }}
                    />
                  </Tooltip>
                )}
              </Stack>

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{
                  flexWrap: "wrap",
                  gap: 0.5,
                  justifyContent: { xs: "flex-start", sm: "flex-end" },
                  mt: { xs: 1, sm: 0 },
                }}
              >
                <Tooltip title={`${book.avgRating || 0} avg rating (${book.ratingCount || 0} ratings)`} placement="top">
                  <Box sx={{ display: "flex", alignItems: "center", bgcolor: "action.hover", px: 0.8, py: 0.3, borderRadius: 1 }}>
                    <StarIcon sx={{ fontSize: "0.9rem", color: "warning.main", mr: 0.5 }} />
                    <Typography variant="caption" fontWeight={500}>
                      {book.avgRating?.toFixed(1) || "0.0"}
                    </Typography>
                  </Box>
                </Tooltip>

                <Tooltip title={`${book.viewCount || 0} views`} placement="top">
                  <Box sx={{ display: "flex", alignItems: "center", bgcolor: "action.hover", px: 0.8, py: 0.3, borderRadius: 1 }}>
                    <VisibilityIcon sx={{ fontSize: "0.9rem", color: "text.secondary", mr: 0.5 }} />
                    <Typography variant="caption" fontWeight={500}>
                      {book.viewCount || 0}
                    </Typography>
                  </Box>
                </Tooltip>

                <Tooltip title={`${book.favCount || 0} favorites`} placement="top">
                  <Box sx={{ display: "flex", alignItems: "center", bgcolor: "action.hover", px: 0.8, py: 0.3, borderRadius: 1 }}>
                    <FavoriteIcon sx={{ fontSize: "0.9rem", color: "error.main", mr: 0.5 }} />
                    <Typography variant="caption" fontWeight={500}>
                      {book.favCount || 0}
                    </Typography>
                  </Box>
                </Tooltip>
              </Stack>
            </Box>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
});
