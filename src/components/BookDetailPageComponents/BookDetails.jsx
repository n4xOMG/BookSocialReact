import { Box, Typography, Chip, Stack, Divider, Paper, Fade, useTheme, useMediaQuery, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Info, Category, LocalOffer, Person, Brush, ExpandMore, ExpandLess } from "@mui/icons-material";
import { useState } from "react";

export const BookDetails = ({ book, categories, tags }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = useState(false);

  // Maximum characters to show in truncated view
  const MAX_CHARS = 280;
  const shouldTruncate = book.description && book.description.length > MAX_CHARS;

  // Helper functions to get category and tag names
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
    return `${book.description.substring(0, MAX_CHARS)}...`;
  };

  return (
    <Fade in={true} timeout={800}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          backgroundColor: "background.paper",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: theme.shadows[2],
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 3,
            fontSize: { xs: "1.8rem", md: "2.2rem" },
            color: "primary.dark",
            lineHeight: 1.2,
          }}
        >
          {book.title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            mb: 3,
            gap: isMobile ? 1 : 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Person sx={{ mr: 1, color: "primary.main", fontSize: "1.2rem" }} />
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              By{" "}
              <Box
                component="span"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    textDecoration: "underline",
                    color: "primary.dark",
                  },
                }}
                onClick={() => navigate(`/profile/${book.author.id}`)}
              >
                {book.authorName}
              </Box>
            </Typography>
          </Box>

          {!isMobile && <Divider orientation="vertical" flexItem sx={{ mx: 2, height: "1rem" }} />}

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Brush sx={{ mr: 1, color: "primary.main", fontSize: "1.2rem" }} />
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              Illustrated by{" "}
              <Box component="span" sx={{ fontWeight: "600" }}>
                {book.artistName || book.authorName}
              </Box>
            </Typography>
          </Box>
        </Box>

        <Box sx={{ position: "relative", mb: 4 }}>
          <Typography
            variant="body1"
            sx={{
              color: "text.primary",
              lineHeight: 1.8,
              fontSize: "1.05rem",
              opacity: 0.9,
              maxWidth: "95%",
            }}
          >
            {getDisplayDescription()}
          </Typography>

          {shouldTruncate && (
            <Button
              onClick={toggleExpanded}
              endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
              sx={{
                mt: 1,
                textTransform: "none",
                fontWeight: 600,
                color: "primary.main",
                p: 0,
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "primary.dark",
                },
              }}
            >
              {expanded ? "Read Less" : "Read More"}
            </Button>
          )}
        </Box>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 3, md: 5 }}
          divider={isMobile ? null : <Divider orientation="vertical" flexItem />}
          sx={{ mb: 4 }}
        >
          {/* Category Section */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <Category sx={{ mr: 1, color: "primary.main", fontSize: "1.3rem" }} />
              <Typography variant="h6" sx={{ fontWeight: "600", fontSize: "1.1rem" }}>
                Category
              </Typography>
            </Box>

            <Chip
              label={getCategoryName(book.categoryId)}
              color="primary"
              variant="filled"
              sx={{
                borderRadius: "16px",
                fontWeight: "500",
                px: 1.5,
                py: 0.75,
                fontSize: "0.9rem",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: theme.shadows[2],
                },
              }}
            />
          </Box>

          {/* Status Section */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <Info sx={{ mr: 1, color: "primary.main", fontSize: "1.3rem" }} />
              <Typography variant="h6" sx={{ fontWeight: "600", fontSize: "1.1rem" }}>
                Status
              </Typography>
            </Box>

            <Chip
              label={book.status}
              color={book.status === "COMPLETED" ? "success" : "warning"}
              variant="filled"
              sx={{
                borderRadius: "16px",
                fontWeight: "500",
                px: 1.5,
                py: 0.75,
                fontSize: "0.9rem",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: theme.shadows[2],
                },
              }}
            />
          </Box>
        </Stack>

        {/* Tags Section */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <LocalOffer sx={{ mr: 1, color: "primary.main", fontSize: "1.3rem" }} />
            <Typography variant="h6" sx={{ fontWeight: "600", fontSize: "1.1rem" }}>
              Tags
            </Typography>
          </Box>

          <Stack
            direction="row"
            sx={{
              flexWrap: "wrap",
              gap: 1.2,
              maxWidth: "100%",
              overflow: "hidden",
            }}
          >
            {getTagNames(book.tagIds).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                variant="outlined"
                color="secondary"
                sx={{
                  borderRadius: "16px",
                  fontWeight: "500",
                  px: 1,
                  fontSize: "0.85rem",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "secondary.light",
                    transform: "translateY(-2px)",
                  },
                }}
              />
            ))}
          </Stack>
        </Box>
      </Paper>
    </Fade>
  );
};
