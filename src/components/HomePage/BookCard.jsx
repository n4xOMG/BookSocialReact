import { MenuBook, Star } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Skeleton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { memo, useCallback, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const BookCard = memo(({ book, onClick, showRating = true, showActions = true, categories = [], tags = [], checkAuth }) => {
  const navigate = useNavigate();
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
  const optimizedCoverUrl = useMemo(() => book.bookCover, [book.bookCover]);

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-8px) scale(1.02)" : "none",
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
        bgcolor: theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.45)" : "rgba(255, 255, 255, 0.22)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid",
        borderColor: isHovered
          ? theme.palette.mode === "dark"
            ? "rgba(157, 80, 187, 0.5)"
            : "rgba(157, 80, 187, 0.4)"
          : theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.12)"
          : "rgba(255, 255, 255, 0.35)",
        boxShadow: isHovered
          ? "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)"
          : "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: isHovered ? "linear-gradient(90deg, #9d50bb, #00c9a7)" : "transparent",
          transition: "all 0.3s ease",
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        sx={{
          position: "relative",
          paddingTop: "140%",
          overflow: "hidden",
          borderRadius: "16px 16px 0 0",
        }}
      >
        {!imageLoaded && (
          <Skeleton
            variant="rectangular"
            className="shimmer"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
              bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
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
            transition: "opacity 0.5s, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer",
            transform: isHovered ? "scale(1.08)" : "scale(1)",
            filter: isHovered ? "brightness(1.1)" : "brightness(1)",
          }}
          onLoad={handleImageLoad}
          onClick={handleBookClick}
          loading="lazy"
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isHovered ? "linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.7))" : "transparent",
            transition: "all 0.3s ease",
            pointerEvents: "none",
          }}
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
              sx={{
                fontWeight: 600,
                background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                color: "#fff",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(157, 80, 187, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            />
          )}

          {showRating && typeof book.avgRating === "number" && (
            <Chip
              icon={<Star sx={{ color: "#FFD700 !important" }} />}
              label={book.avgRating.toFixed(1)}
              size="small"
              sx={{
                bgcolor: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(10px)",
                color: "white",
                fontWeight: 600,
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                border: "1px solid rgba(255, 215, 0, 0.3)",
                "& .MuiChip-icon": { color: "#FFD700" },
              }}
            />
          )}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 2, pb: 0.5, px: 2.5 }}>
        <Tooltip title={book.title} placement="top">
          <Typography
            variant="subtitle1"
            component="h3"
            className="font-serif"
            fontWeight="700"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              cursor: "pointer",
              transition: "all 0.3s ease",
              color: isHovered ? "primary.main" : "text.primary",
              textAlign: "left",
              fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
              lineHeight: 1.3,
              mb: 1,
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
          Written by: {book.artistName}
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
          <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 0.7 }}>
            <Chip
              label={book.latestChapterNumber ? `Ch ${book.latestChapterNumber}` : "New"}
              size="small"
              sx={{
                fontSize: "0.65rem",
                height: "24px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                color: "#fff",
                fontWeight: 600,
                border: "1px solid rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(8px)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: "linear-gradient(135deg, #b968c7, #9d50bb)",
                  transform: "scale(1.05)",
                },
              }}
            />
            {bookTags.slice(0, 2).map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                sx={{
                  fontSize: "0.65rem",
                  height: "24px",
                  borderRadius: "12px",
                  bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(157, 80, 187, 0.08)",
                  color: "text.secondary",
                  fontWeight: 500,
                  border: "1px solid",
                  borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(157, 80, 187, 0.2)",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.15)" : "rgba(157, 80, 187, 0.15)",
                    transform: "scale(1.05)",
                  },
                }}
              />
            ))}
            {bookTags.length > 2 && (
              <Chip
                label={`+${bookTags.length - 2}`}
                size="small"
                sx={{
                  fontSize: "0.65rem",
                  height: "24px",
                  borderRadius: "12px",
                  bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(157, 80, 187, 0.08)",
                  color: "text.secondary",
                  fontWeight: 500,
                  border: "1px solid",
                  borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(157, 80, 187, 0.2)",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.15)" : "rgba(157, 80, 187, 0.15)",
                    transform: "scale(1.05)",
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
            pt: 1.5,
            pb: 1.5,
            borderTop: "1px solid",
            borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
            mt: 1,
            background: theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
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
              borderRadius: "12px",
              textTransform: "none",
              px: 2.5,
              py: 0.6,
              fontWeight: 600,
              background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
              boxShadow: isHovered ? "0 6px 20px rgba(157, 80, 187, 0.4)" : "0 2px 8px rgba(157, 80, 187, 0.2)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-2px) scale(1.05)",
                background: "linear-gradient(135deg, #b968c7, #9d50bb)",
                boxShadow: "0 8px 24px rgba(157, 80, 187, 0.5)",
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
