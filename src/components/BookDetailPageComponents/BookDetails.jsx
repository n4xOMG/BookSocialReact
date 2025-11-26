import { Box, Typography, Chip, Stack, Divider, Paper, Fade, useMediaQuery, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Info, Category, LocalOffer, Person, Brush, ExpandMore, ExpandLess, EditNote } from "@mui/icons-material";
import { useState } from "react";

export const BookDetails = ({ book, categories, tags }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = useState(false);

  const MAX_CHARS_DESKTOP = 210;
  const MAX_CHARS_MOBILE = 100;

  const currentMaxChars = isMobile ? MAX_CHARS_MOBILE : MAX_CHARS_DESKTOP;
  const shouldTruncate = book.description && book.description.length > currentMaxChars;

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
    return `${book.description.substring(0, currentMaxChars)}...`;
  };

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            mb: isMobile ? 2 : 3,
            fontSize: { xs: "1.8rem", md: "2.4rem" },
            background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.2,
            letterSpacing: "-0.5px",
          }}
        >
          {book.title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            mb: isMobile ? 1 : 3,
            gap: isMobile ? 1 : 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {getCategoryName(book.categoryId) === "Text-Dominant Books" ? (
              <EditNote sx={{ mr: 1, color: "primary.main", fontSize: "1.2rem" }} />
            ) : (
              <Brush sx={{ mr: 1, color: "primary.main", fontSize: "1.2rem" }} />
            )}
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              {getCategoryName(book.categoryId) === "Text-Dominant Books" ? "Written by " : "Illustrated by "}
              <Box component="span" sx={{ fontWeight: "600" }}>
                {book.artistName || book.authorName}
              </Box>
            </Typography>
          </Box>

          {!isMobile && <Divider orientation="vertical" flexItem sx={{ mx: 2, height: "1rem" }} />}

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Person sx={{ mr: 1, color: "primary.main", fontSize: "1.2rem" }} />
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              Uploaded by{" "}
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
        </Box>

        <Box sx={{ position: "relative", mb: isMobile ? 0 : 2 }}>
          <Typography
            variant="body1"
            sx={{
              color: "text.primary",
              lineHeight: 1.8,
              fontSize: "1.05rem",
              opacity: 0.9,
              maxWidth: "95%",
              textAlign: "justify",
            }}
          >
            {/* 3. Gọi hàm mà không cần truyền isMobile */}
            {getDisplayDescription()}
          </Typography>

          {/* 4. Sử dụng biến shouldTruncate đã được tính toán ở cấp component */}
          {shouldTruncate && (
            <Button
              onClick={toggleExpanded}
              endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
              sx={{
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
              {expanded ? "Collapse" : "More"}
            </Button>
          )}
        </Box>

        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={isMobile ? 1 : 5}
          divider={isMobile ? null : <Divider orientation="vertical" flexItem />}
          sx={{ mb: isMobile ? 0 : 4 }}
        >
          {/* Category Section */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: isMobile ? 1 : 1.5 }}>
              <Category sx={{ mr: 1, color: "primary.main", fontSize: "1.3rem" }} />
              <Typography variant="h6" sx={{ fontWeight: "600", fontSize: "1.1rem" }}>
                Category
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: isMobile ? "flex-start" : "center",
              }}
            >
              <Chip
                label={getCategoryName(book.categoryId)}
                variant="filled"
                sx={{
                  borderRadius: "12px",
                  fontWeight: 600,
                  px: 2,
                  py: 0.75,
                  fontSize: "0.9rem",
                  background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                  color: "#fff",
                  border: "1px solid rgba(157, 80, 187, 0.3)",
                  boxShadow: "0 4px 12px rgba(157, 80, 187, 0.25)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-2px) scale(1.05)",
                    boxShadow: "0 6px 20px rgba(157, 80, 187, 0.4)",
                  },
                }}
              />
            </Box>
          </Box>

          {/* Status Section */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: isMobile ? 1 : 1.5 }}>
              <Info sx={{ mr: 1, color: "primary.main", fontSize: "1.3rem" }} />
              <Typography variant="h6" sx={{ fontWeight: "600", fontSize: "1.1rem" }}>
                Status
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: isMobile ? "flex-start" : "center",
              }}
            >
              <Chip
                label={book.status}
                variant="filled"
                sx={{
                  borderRadius: "12px",
                  fontWeight: 600,
                  px: 2,
                  py: 0.75,
                  fontSize: "0.9rem",
                  background:
                    book.status === "COMPLETED" ? "linear-gradient(135deg, #00c9a7, #56efca)" : "linear-gradient(135deg, #ff6b6b, #ee5a52)",
                  color: "#fff",
                  border: book.status === "COMPLETED" ? "1px solid rgba(0, 201, 167, 0.3)" : "1px solid rgba(255, 107, 107, 0.3)",
                  boxShadow: book.status === "COMPLETED" ? "0 4px 12px rgba(0, 201, 167, 0.25)" : "0 4px 12px rgba(255, 107, 107, 0.25)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-2px) scale(1.05)",
                    boxShadow: book.status === "COMPLETED" ? "0 6px 20px rgba(0, 201, 167, 0.4)" : "0 6px 20px rgba(255, 107, 107, 0.4)",
                  },
                }}
              />
            </Box>
          </Box>
        </Stack>

        {/* Tags Section */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: isMobile ? 1 : 2 }}>
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
            }}
          >
            {getTagNames(book.tagIds).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                variant="outlined"
                sx={{
                  borderRadius: "12px",
                  fontWeight: 500,
                  px: 1.5,
                  fontSize: "0.85rem",
                  background: (theme) => (theme.palette.mode === "dark" ? "rgba(132, 250, 176, 0.08)" : "rgba(0, 201, 167, 0.08)"),
                  backdropFilter: "blur(8px)",
                  border: "1px solid",
                  borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(132, 250, 176, 0.2)" : "rgba(0, 201, 167, 0.25)"),
                  color: (theme) => (theme.palette.mode === "dark" ? "#84fab0" : "#00c9a7"),
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    background: (theme) => (theme.palette.mode === "dark" ? "rgba(132, 250, 176, 0.15)" : "rgba(0, 201, 167, 0.15)"),
                    borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(132, 250, 176, 0.4)" : "rgba(0, 201, 167, 0.4)"),
                    transform: "translateY(-2px) scale(1.05)",
                    boxShadow: "0 4px 12px rgba(0, 201, 167, 0.2)",
                  },
                }}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </Fade>
  );
};
