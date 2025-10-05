import { MenuBook, Star } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Divider, Skeleton, Tooltip, Typography, useTheme } from "@mui/material";
import { memo, useCallback, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getOptimizedImageUrl } from "../../utils/optimizeImages";

export const BookCard = memo(({ book, onClick, showRating = true, showActions = true, categories = [], tags = [], checkAuth }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();

  const handleImageLoad = () => setImageLoaded(true);

  // Optimize category and tag lookup with useMemo to avoid recalculation on each render
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

      if (!book || !book.id) {
        console.error("Invalid book object or book id:", book);
        return;
      }

      if (onClick && typeof onClick === "function") {
        onClick(book.id);
      } else {
        navigate(`/books/${book.id}`);
      }
    },
    [book, onClick, navigate]
  );

  const handleAuthorClick = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      navigate(`/profile/${book.author?.id || book.authorId}`);
    },
    [navigate, book.author, book.authorId]
  );

  // Optimize image URL
  const optimizedCoverUrl = useMemo(() => getOptimizedImageUrl(book.bookCover), [book.bookCover]);

  return (
    <Card
      elevation={isHovered ? 3 : 1}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-4px)" : "none",
        borderRadius: 2.5,
        overflow: "hidden",
        position: "relative",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: isHovered ? "primary.light" : "transparent",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box sx={{ position: "relative", paddingTop: "140%" }}>
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
          image={optimizedCoverUrl}
          alt={book.title}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imageLoaded ? 1 : 0,
            transition: "opacity 0.5s, transform 0.3s",
            cursor: "pointer",
            transform: isHovered ? "scale(1.03)" : "scale(1)",
          }}
          onLoad={handleImageLoad}
          onClick={handleBookClick}
          loading="lazy"
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            m: 1.5,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 0.8,
          }}
        >
          {book.editorChoice && (
            <Chip
              label="Editor's Choice"
              size="small"
              color="primary"
              sx={{
                fontWeight: 600,
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                borderRadius: "16px",
              }}
            />
          )}

          {showRating && typeof book.avgRating === "number" && (
            <Chip
              icon={<Star sx={{ color: "#FFD700 !important" }} />}
              label={book.avgRating.toFixed(1)}
              size="small"
              sx={{
                bgcolor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                fontWeight: 500,
                borderRadius: "16px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                "& .MuiChip-icon": { color: "white" },
              }}
            />
          )}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 1, pb: 0.2, px: 2.5 }}>
        <Tooltip title={book.title} placement="top">
          <Typography
            variant="subtitle1"
            component="h3"
            fontWeight="600"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              cursor: "pointer",
              transition: "color 0.2s",
              color: isHovered ? "primary.main" : "text.primary",
              textAlign: "left",
            }}
            onClick={handleBookClick}
          >
            {book.title}
          </Typography>
        </Tooltip>

        <Divider sx={{ my: 0.5 }} />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            cursor: "pointer",
            transition: "color 0.2s",
            fontSize: "0.8rem",
            textAlign: "left",
          }}
        >
          Written by: {book.artistName }
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            cursor: "pointer",
            transition: "color 0.2s",
            "&:hover": { color: "primary.main" },
            fontSize: "0.7rem",
            textAlign: "left",
          }}
          onClick={handleAuthorClick}
        >
          Upload by: {book.authorName || book.author?.name}
        </Typography>

        {category && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1.5,
              fontSize: "0.7rem",
              fontWeight: 500,
              opacity: 0.8,
              textAlign: "left",
            }}
          >
            Category: {category.name}
          </Typography>
        )}

        {bookTags.length > 0 && (
          <Box sx={{ mt: 0.5, display: "flex", flexWrap: "wrap", gap: 0.7 }}>
            <Chip
              label={book.latestChapterNumber ? `Ch ${book.latestChapterNumber}` : "New"}
              size="small"
              sx={{
                  fontSize: "0.6rem",
                  height: "22px",
                  borderRadius: "12px",
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 500,
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: theme.palette.background.paper,
                  },
              }}
            />
            {bookTags.slice(0, 2).map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                sx={{
                  fontSize: "0.6rem",
                  height: "22px",
                  borderRadius: "12px",
                  bgcolor: theme.palette.background.gradient,
                  color: "text.secondary",
                  fontWeight: 500,
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: theme.palette.background.paper,
                  },
                }}
              />
            ))}
            {bookTags.length > 2 && (
              <Chip
                label={`+${bookTags.length - 2}`}
                size="small"
                sx={{
                  fontSize: "0.6rem",
                  height: "22px",
                  borderRadius: "12px",
                  bgcolor: theme.palette.background.gradient,
                  color: "text.secondary",
                  fontWeight: 500,
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: theme.palette.background.paper,
                  },
                }}
              />
            )}
          </Box>
        )}
      </CardContent>

      {showActions && (
        <CardActions
          sx={{
            justifyContent: "space-between",
            p: 2.5,
            pt: 1,
            pb: 1,
            borderTop: "1px solid",
            borderColor: "divider",
            mt: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MenuBook sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {book.latestChapterNumber ? `Ch ${book.latestChapterNumber}` : "New"}
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            onClick={handleBookClick}
            disableElevation
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              px: 2.5,
              py: 0.5,
              fontWeight: 600,
              boxShadow: isHovered ? "0 4px 8px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.3s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
              },
            }}
          >
            Read Now
          </Button>
        </CardActions>
      )}
    </Card>
  );
});
