import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LabelIcon from "@mui/icons-material/Label";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import StarIcon from "@mui/icons-material/Star";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Card, CardContent, CardMedia, Chip, Divider, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import React from "react";

export const BookItem = React.memo(({ book, isSelected, onSelect, onEdit, onDelete }) => {
  const theme = useTheme();

  const chipLabelSx = {
    height: "22px",
    fontSize: "0.7rem",
    fontWeight: 500,
  };

  const statChipSx = {
    ...chipLabelSx,
    "& .MuiChip-icon": { fontSize: "0.9rem" },
  };

  return (
    <Card
      onClick={() => onSelect(book.id)}
      elevation={0}
      sx={{
        display: "flex",
        height: 170,
        transition: "all 0.3s ease",
        border: isSelected ? `2px solid ${theme.palette.primary.main}` : "1px solid",
        borderColor: isSelected
          ? theme.palette.primary.main
          : theme.palette.mode === "dark"
          ? "rgba(157, 80, 187, 0.2)"
          : "rgba(157, 80, 187, 0.15)",
        borderRadius: "16px",
        position: "relative",
        background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        "&:hover": {
          boxShadow: isSelected ? "0 8px 32px rgba(157, 80, 187, 0.4)" : "0 8px 24px rgba(0, 0, 0, 0.15)",
          transform: "translateY(-3px)",
          borderColor: theme.palette.primary.main,
        },
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: 110,
          height: 170,
          flexShrink: 0,
          objectFit: "cover",
          boxShadow: 2,
          borderRadius: "4px 0 0 4px",
        }}
        image={book.bookCover || "https://via.placeholder.com/110x160?text=No+Cover"}
        alt={book.title}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minWidth: 0,
          p: 1.5, // Thêm padding cho toàn bộ nội dung
          overflow: "auto", // Sử dụng 'auto' để nội dung cuộn khi tràn
        }}
      >
        <Box
          sx={{
            flexGrow: 1, // Box này sẽ lấp đầy không gian thừa
            display: "flex",
            flexDirection: "column",
            // loại bỏ justifyContent
            overflow: "hidden",
          }}
        >
          {/* Tiêu đề và nút action */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                mr: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <Tooltip title={book.title} placement="top" arrow>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textAlign: "left",
                  }}
                >
                  {book.title}
                </Typography>
              </Tooltip>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2, // Chỉ hiển thị tối đa 2 dòng mô tả
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: 1.4,
                  mt: 0.5,
                  textAlign: "left",
                }}
              >
                {book.description || "No description available"}
              </Typography>
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
                    color: "#00c9a7",
                    p: 0.5,
                    mr: 0.5,
                    background: theme.palette.mode === "dark" ? "rgba(0, 201, 167, 0.2)" : "rgba(0, 201, 167, 0.15)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(0, 201, 167, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #00c9a7, #56efca)",
                      color: "#fff",
                      transform: "scale(1.05)",
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
                    color: "#ff6b6b",
                    p: 0.5,
                    background: theme.palette.mode === "dark" ? "rgba(255, 107, 107, 0.2)" : "rgba(255, 107, 107, 0.15)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 107, 107, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
                      color: "#fff",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
        {/* Divider và các tag, rating */}
        <Box sx={{ mt: "auto", flexShrink: 0 }}>
          <Divider sx={{ mb: 1.5 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 0.5 }}>
              {book.status && (
                <Chip
                  label={book.status.charAt(0).toUpperCase() + book.status.slice(1).toLowerCase()}
                  size="small"
                  sx={{
                    ...chipLabelSx,
                    borderRadius: "8px",
                    fontWeight: 600,
                    background:
                      book.status === "COMPLETED"
                        ? "linear-gradient(135deg, #00c9a7, #56efca)"
                        : "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "#fff",
                    border: "none",
                  }}
                />
              )}
              {book.chapterCount > 0 && (
                <Tooltip title="Chapters">
                  <Chip
                    icon={<LibraryBooksIcon sx={{ color: "#9d50bb !important" }} />}
                    label={`${book.chapterCount}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      ...statChipSx,
                      borderRadius: "8px",
                      borderColor: "rgba(157, 80, 187, 0.3)",
                      background: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.1)" : "rgba(157, 80, 187, 0.05)",
                      backdropFilter: "blur(8px)",
                    }}
                  />
                </Tooltip>
              )}
              {book.tagIds?.length > 0 && (
                <Tooltip title={`${book.tagIds.length} ${book.tagIds.length === 1 ? "tag" : "tags"}`}>
                  <Chip
                    icon={<LabelIcon sx={{ color: "#00c9a7 !important" }} />}
                    label={book.tagIds.length}
                    size="small"
                    variant="outlined"
                    sx={{
                      ...statChipSx,
                      borderRadius: "8px",
                      borderColor: "rgba(0, 201, 167, 0.3)",
                      background: theme.palette.mode === "dark" ? "rgba(0, 201, 167, 0.1)" : "rgba(0, 201, 167, 0.05)",
                      backdropFilter: "blur(8px)",
                    }}
                  />
                </Tooltip>
              )}
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                flexWrap: "wrap",
                justifyContent: { xs: "flex-start", sm: "flex-end" },
              }}
            >
              <Tooltip title={`${book.avgRating?.toFixed(1) || 0} avg rating (${book.ratingCount || 0} ratings)`} placement="top">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 0.8,
                    py: 0.3,
                    borderRadius: "8px",
                    background: theme.palette.mode === "dark" ? "rgba(255, 193, 7, 0.15)" : "rgba(255, 193, 7, 0.1)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255, 193, 7, 0.3)",
                  }}
                >
                  <StarIcon sx={{ fontSize: "0.9rem", color: "#ffc107", mr: 0.5 }} />
                  <Typography variant="caption" fontWeight={600} sx={{ color: "#ffc107" }}>
                    {book.avgRating?.toFixed(1) || "0.0"}
                  </Typography>
                </Box>
              </Tooltip>

              <Tooltip title={`${book.viewCount || 0} views`} placement="top">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 0.8,
                    py: 0.3,
                    borderRadius: "8px",
                    background: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.15)" : "rgba(157, 80, 187, 0.1)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(157, 80, 187, 0.3)",
                  }}
                >
                  <VisibilityIcon sx={{ fontSize: "0.9rem", color: "#9d50bb", mr: 0.5 }} />
                  <Typography variant="caption" fontWeight={600} sx={{ color: "#9d50bb" }}>
                    {book.viewCount || 0}
                  </Typography>
                </Box>
              </Tooltip>

              <Tooltip title={`${book.favCount || 0} favorites`} placement="top">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 0.8,
                    py: 0.3,
                    borderRadius: "8px",
                    background: theme.palette.mode === "dark" ? "rgba(255, 107, 107, 0.15)" : "rgba(255, 107, 107, 0.1)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255, 107, 107, 0.3)",
                  }}
                >
                  <FavoriteIcon sx={{ fontSize: "0.9rem", color: "#ff6b6b", mr: 0.5 }} />
                  <Typography variant="caption" fontWeight={600} sx={{ color: "#ff6b6b" }}>
                    {book.favCount || 0}
                  </Typography>
                </Box>
              </Tooltip>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Card>
  );
});
