import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LabelIcon from "@mui/icons-material/Label";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import StarIcon from "@mui/icons-material/Star";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Button, Card, CardMedia, Chip, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import React from "react";

const BookCover = ({ book }) => {
  const coverUrl = typeof book.bookCover === "object" ? book.bookCover.url : book.bookCover;
  // Check for isMild or mild property directly on the bookCover object if it's an object
  const isMild = typeof book.bookCover === "object" ? (book.bookCover.isMild || book.bookCover.mild) : false;
  const [isBlurred, setIsBlurred] = React.useState(isMild);

  return (
    <>
      <CardMedia
        component="img"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: isBlurred ? "blur(20px)" : "none",
          cursor: isBlurred ? "default" : "pointer",
        }}
        image={coverUrl || "https://via.placeholder.com/120x180?text=No+Cover"}
        alt={book.title}
      />
      {isBlurred && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(0,0,0,0.3)",
            zIndex: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: "white", mb: 0.5, fontWeight: "bold", fontSize: "0.6rem" }}>
            Mild
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setIsBlurred(false);
            }}
            sx={{
              minWidth: "auto",
              padding: "2px 6px",
              fontSize: "0.6rem",
              bgcolor: "rgba(0,0,0,0.6)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
            }}
          >
            Show
          </Button>
        </Box>
      )}
    </>
  );
};

export const BookItem = React.memo(({ book, isSelected, onSelect, onEdit, onDelete }) => {
  const theme = useTheme();

  return (
    <Card
      onClick={() => onSelect(book.id)}
      elevation={isSelected ? 4 : 1}
      sx={{
        display: "flex",
        height: 180,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid",
        borderColor: isSelected ? theme.palette.primary.main : "transparent",
        borderRadius: "12px",
        position: "relative",
        bgcolor: isSelected ? theme.palette.action.selected : theme.palette.background.paper,
        cursor: "pointer",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[4],
          borderColor: theme.palette.primary.light,
        },
      }}
    >
      {/* Cover Image */}
      <Box sx={{ position: "relative", width: 120, height: "100%", flexShrink: 0 }}>
        <BookCover book={book} />
        {/* Status Overlay */}
        {book.status && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              zIndex: 1,
            }}
          >
            <Chip
              label={book.status}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                bgcolor: book.status === "COMPLETED" ? theme.palette.success.main : theme.palette.info.main,
                color: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            />
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
            <Tooltip title={book.title}>
              <Typography
                variant="h6"
                className="font-serif"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  lineHeight: 1.2,
                  mb: 0.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: theme.palette.text.primary,
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
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontSize: "0.85rem",
                lineHeight: 1.5,
              }}
            >
              {book.description || "No description available"}
            </Typography>
          </Box>

          {/* Actions - Always visible on hover or selection */}
          <Stack 
            direction="row" 
            spacing={0.5} 
            sx={{ 
              opacity: { xs: 1, md: isSelected ? 1 : 0 }, 
              transition: "opacity 0.2s",
              ".MuiCard-root:hover &": { opacity: 1 } 
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onEdit(book); }}
              sx={{ 
                color: theme.palette.text.secondary,
                "&:hover": { color: theme.palette.primary.main, bgcolor: theme.palette.action.hover }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onDelete(book); }}
              sx={{ 
                color: theme.palette.text.secondary,
                "&:hover": { color: theme.palette.error.main, bgcolor: theme.palette.error.light + "20" }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>

        {/* Stats & Tags */}
        <Box sx={{ mt: "auto" }}>
          <Stack direction="row" spacing={2} sx={{ mb: 1.5, color: theme.palette.text.secondary }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <StarIcon sx={{ fontSize: 16, color: theme.palette.warning.main }} />
              <Typography variant="caption" fontWeight={600}>{book.avgRating?.toFixed(1) || "0.0"}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <VisibilityIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" fontWeight={600}>{book.viewCount || 0}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <FavoriteIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
              <Typography variant="caption" fontWeight={600}>{book.favCount || 0}</Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
             <Chip
                icon={<LibraryBooksIcon sx={{ fontSize: "14px !important" }} />}
                label={`${book.chapterCount || 0} Chapters`}
                size="small"
                variant="outlined"
                sx={{ 
                  height: 24, 
                  fontSize: "0.75rem", 
                  borderRadius: "6px",
                  borderColor: theme.palette.divider 
                }}
             />
             {book.tagIds?.length > 0 && (
               <Chip
                 icon={<LabelIcon sx={{ fontSize: "14px !important" }} />}
                 label={`${book.tagIds.length} Tags`}
                 size="small"
                 variant="outlined"
                 sx={{ 
                   height: 24, 
                   fontSize: "0.75rem", 
                   borderRadius: "6px",
                   borderColor: theme.palette.divider 
                 }}
               />
             )}
          </Stack>
        </Box>
      </Box>
    </Card>
  );
});
