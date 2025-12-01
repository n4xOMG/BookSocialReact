import { Star } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const BookCard = memo(({ book, onClick, showRating = true, showActions = true, categories = [], tags = [], checkAuth }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const theme = useTheme();

  const handleImageLoad = () => setImageLoaded(true);

  const category = useMemo(() => {
    if (!book.categoryId || !categories.length) return null;
    return categories.find((category) => book.categoryId === category.id);
  }, [book.categoryId, categories]);

  const bookTags = useMemo(() => {
    if (!book.tagIds || !book.tagIds.length || !tags.length) return [];
    return tags.filter((tag) => book.tagIds.includes(tag.id));
  }, [book.tagIds, tags]);

  const handleBookClick = useCallback(
    (e) => {
      if (e) e.preventDefault();
      if (!book || !book.id) return;
      if (onClick && typeof onClick === "function") {
        onClick(book.id);
      } else {
        navigate(`/books/${book.id}`);
      }
    },
    [book, onClick, navigate]
  );

  const optimizedCoverUrl = useMemo(() => book.bookCover.url, [book.bookCover.url]);

  return (
    <Card
      onClick={handleBookClick}
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        bgcolor: theme.palette.background.paper,
        border: "1px solid",
        borderColor: theme.palette.divider,
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
          borderColor: theme.palette.primary.light,
        },
      }}
    >
      <Box sx={{ position: "relative", paddingTop: "145%", overflow: "hidden" }}>
        {!imageLoaded && (
          <Skeleton
            variant="rectangular"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
            }}
            animation="wave"
          />
        )}
        <CardMedia
          component="img"
          image={optimizedCoverUrl || "https://via.placeholder.com/150x220?text=No+Cover"}
          alt={book.title}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imageLoaded ? 1 : 0,
            transition: "opacity 0.5s, transform 0.5s ease",
            ".MuiCard-root:hover &": {
              transform: "scale(1.05)",
            },
          }}
          onLoad={handleImageLoad}
        />
        
        {/* Overlays */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          {book.editorChoice && (
            <Chip
              label="Editor's Choice"
              size="small"
              sx={{
                height: 20,
                fontSize: "0.65rem",
                fontWeight: 700,
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            />
          )}
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
          }}
        >
          {showRating && book.avgRating > 0 && (
             <Box
               sx={{
                 display: "flex",
                 alignItems: "center",
                 gap: 0.5,
                 bgcolor: "rgba(0,0,0,0.7)",
                 backdropFilter: "blur(4px)",
                 borderRadius: "12px",
                 px: 1,
                 py: 0.5,
               }}
             >
               <Star sx={{ fontSize: 14, color: theme.palette.accent.gold }} />
               <Typography variant="caption" sx={{ color: "#fff", fontWeight: 700, lineHeight: 1 }}>
                 {book.avgRating.toFixed(1)}
               </Typography>
             </Box>
          )}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2, display: "flex", flexDirection: "column" }}>
        <Tooltip title={book.title} placement="top">
          <Typography
            variant="subtitle1"
            className="font-serif"
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              lineHeight: 1.3,
              mb: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              color: theme.palette.text.primary,
              transition: "color 0.2s",
              ".MuiCard-root:hover &": {
                color: theme.palette.primary.main,
              },
            }}
          >
            {book.title}
          </Typography>
        </Tooltip>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: "0.85rem" }}>
          by {book.authorName || book.author?.name || "Unknown"}
        </Typography>

        <Box sx={{ mt: "auto" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
             {category && (
               <Typography variant="caption" color="primary" fontWeight={600} sx={{ textTransform: "uppercase", fontSize: "0.7rem" }}>
                 {category.name}
               </Typography>
             )}
             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <VisibilityIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
                  <Typography variant="caption" color="text.secondary">{book.viewCount || 0}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <FavoriteIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
                  <Typography variant="caption" color="text.secondary">{book.favCount || 0}</Typography>
                </Box>
             </Box>
          </Stack>

          {bookTags.length > 0 && (
            <Stack direction="row" spacing={0.5} sx={{ overflow: "hidden", height: 24 }}>
              {bookTags.slice(0, 2).map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 22,
                    fontSize: "0.65rem",
                    borderRadius: "6px",
                    borderColor: theme.palette.divider,
                  }}
                />
              ))}
              {bookTags.length > 2 && (
                 <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "center", ml: 0.5 }}>
                   +{bookTags.length - 2}
                 </Typography>
              )}
            </Stack>
          )}
        </Box>
      </CardContent>
    </Card>
  );
});
