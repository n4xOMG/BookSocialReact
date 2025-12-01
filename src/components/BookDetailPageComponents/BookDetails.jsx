import { Box, Typography, Chip, Stack, Divider, Fade, useMediaQuery, Button, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Info, Category, LocalOffer, Person, Brush, ExpandMore, ExpandLess, EditNote } from "@mui/icons-material";
import { useState } from "react";

export const BookDetails = ({ book, categories, tags }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = useState(false);

  const MAX_CHARS_DESKTOP = 210;
  const MAX_CHARS_MOBILE = 100;

  const currentMaxChars = isMobile ? MAX_CHARS_MOBILE : MAX_CHARS_DESKTOP;
  const shouldTruncate = book.description && book.description.length > currentMaxChars;

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "N/A";
  };

  const getTagNames = (tagIds) => {
    return tags.filter((tag) => tagIds.includes(tag.id)).map((tag) => tag.name);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const getDisplayDescription = () => {
    if (!shouldTruncate || expanded) {
      return book.description;
    }
    return `${book.description.substring(0, currentMaxChars)}...`;
  };

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Typography
          variant="h4"
          className="font-serif"
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: "1.8rem", md: "2.4rem" },
            color: theme.palette.text.primary,
            lineHeight: 1.2,
          }}
        >
          {book.title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 3,
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {getCategoryName(book.categoryId) === "Text-Dominant Books" ? (
              <EditNote sx={{ mr: 1, color: theme.palette.primary.main }} />
            ) : (
              <Brush sx={{ mr: 1, color: theme.palette.primary.main }} />
            )}
            <Typography variant="body1" color="text.primary">
              {getCategoryName(book.categoryId) === "Text-Dominant Books" ? "Written by " : "Illustrated by "}
              <Box component="span" fontWeight="600">
                {book.artistName || book.authorName}
              </Box>
            </Typography>
          </Box>

          {!isMobile && <Divider orientation="vertical" flexItem />}

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Person sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="body1" color="text.primary">
              Uploaded by{" "}
              <Box
                component="span"
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.primary.main,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => navigate(`/profile/${book.author.id}`)}
              >
                {book.authorName}
              </Box>
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              lineHeight: 1.8,
              fontSize: "1.05rem",
              textAlign: "justify",
            }}
          >
            {getDisplayDescription()}
          </Typography>

          {shouldTruncate && (
            <Button
              onClick={toggleExpanded}
              endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: theme.palette.primary.main,
                p: 0,
                mt: 1,
                "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
              }}
            >
              {expanded ? "Collapse" : "Read More"}
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Stack direction={{ xs: "column", md: "row" }} spacing={4} divider={isMobile ? null : <Divider orientation="vertical" flexItem />}>
          {/* Category */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <Category sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">
                Category
              </Typography>
            </Box>
            <Chip
              label={getCategoryName(book.categoryId)}
              sx={{
                borderRadius: "8px",
                fontWeight: 600,
                bgcolor: theme.palette.primary.main + "20",
                color: theme.palette.primary.main,
                border: `1px solid ${theme.palette.primary.main}40`,
              }}
            />
          </Box>

          {/* Status */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <Info sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">
                Status
              </Typography>
            </Box>
            <Chip
              label={book.status}
              sx={{
                borderRadius: "8px",
                fontWeight: 600,
                bgcolor: book.status === "COMPLETED" ? theme.palette.success.main + "20" : theme.palette.warning.main + "20",
                color: book.status === "COMPLETED" ? theme.palette.success.main : theme.palette.warning.main,
                border: `1px solid ${book.status === "COMPLETED" ? theme.palette.success.main : theme.palette.warning.main}40`,
              }}
            />
          </Box>

          {/* Tags */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <LocalOffer sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">
                Tags
              </Typography>
            </Box>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {getTagNames(book.tagIds).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: "8px",
                    borderColor: theme.palette.divider,
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Fade>
  );
};
