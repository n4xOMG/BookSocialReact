import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useMemo } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";

const MangaPageContent = ({
  chapter,
  viewMode,
  currentPage,
  handlePageChange,
  hoverZone,
  setHoverZone,
  toggleFloatingMenu,
  readingProgress,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [loadingImages, setLoadingImages] = useState(true);
  const [loadedPages, setLoadedPages] = useState([]);

  const extractImageUrls = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const images = doc.querySelectorAll("img");
    return Array.from(images).map((img) => img.src);
  };

  const pages = useMemo(() => extractImageUrls(chapter?.content || ""), [chapter?.content]);

  useEffect(() => {
    setLoadingImages(true);

    const promises = pages.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = reject;
      });
    });

    Promise.all(promises)
      .then((loadedImages) => {
        setLoadedPages(loadedImages);
        setLoadingImages(false);
      })
      .catch((err) => console.error("Failed to load images", err));
  }, [pages]);

  const renderPages = () => {
    if (loadingImages) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
      );
    }

    if (viewMode === "vertical") {
      return (
        <Box
          onClick={toggleFloatingMenu}
          sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, px: isSmallScreen ? 5 : 10 }}
        >
          {loadedPages.map((page, index) => (
            <Box key={index} component="img" src={page} alt={`Page ${index + 1}`} sx={{ width: "100%", objectFit: "contain" }} />
          ))}
        </Box>
      );
    }

    if (viewMode === "double" && currentPage < loadedPages.length - 1) {
      return (
        <Box onClick={toggleFloatingMenu} sx={{ display: "flex", justifyContent: "center", objectFit: "contain", gap: 0 }}>
          <Box
            component="img"
            src={loadedPages[currentPage]}
            alt={`Page ${currentPage + 1}`}
            sx={{ width: "auto", height: "100vh", objectFit: "contain", flexShrink: 0 }}
          />
          <Box
            component="img"
            src={loadedPages[currentPage + 1]}
            alt={`Page ${currentPage + 2}`}
            sx={{ width: "auto", height: "100vh", objectFit: "contain", flexShrink: 0 }}
          />
        </Box>
      );
    }

    return (
      <Box onClick={toggleFloatingMenu} sx={{ display: "flex", justifyContent: "center", objectFit: "contain" }}>
        <Box
          component="img"
          src={loadedPages[currentPage]}
          alt={`Page ${currentPage + 1}`}
          sx={{ maxWidth: "100%", height: "100vh", objectFit: "contain" }}
        />
      </Box>
    );
  };

  return (
    <Box
      sx={{ position: "relative", width: "100%", height: "100%", flex: 1, objectFit: "contain", overflow: "auto", bgcolor: "#212121" }}
      role="region"
      aria-label="Manga chapter content"
    >
      {chapter ? (
        <>
          {renderPages()}
          {viewMode !== "vertical" && (
            <>
              <Box
                sx={{ position: "absolute", left: 0, top: 0, width: "25%", height: "100vh", cursor: "pointer", border: "none" }}
                onClick={() => handlePageChange(viewMode === "double" ? currentPage - 2 : currentPage - 1)}
                onMouseEnter={() => setHoverZone("left")}
                onMouseLeave={() => setHoverZone(null)}
                aria-label="Previous page"
                role="button"
                tabIndex={0}
              >
                {hoverZone === "left" && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: 4,
                      top: "50%",
                      transform: "translateY(-50%)",
                      bgcolor: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      p: 2,
                      borderRadius: "50%",
                    }}
                  >
                    <ChevronLeft />
                  </Box>
                )}
              </Box>
              <Box
                sx={{ position: "absolute", right: 0, top: 0, width: "25%", height: "100%", cursor: "pointer" }}
                onClick={() => handlePageChange(viewMode === "double" ? currentPage + 2 : currentPage + 1)}
                onMouseEnter={() => setHoverZone("right")}
                onMouseLeave={() => setHoverZone(null)}
                aria-label="Next page"
                role="button"
                tabIndex={0}
              >
                {hoverZone === "right" && (
                  <Box
                    sx={{
                      position: "absolute",
                      right: 4,
                      top: "50%",
                      transform: "translateY(-50%)",
                      bgcolor: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      p: 2,
                      borderRadius: "50%",
                    }}
                  >
                    <ChevronRight />
                  </Box>
                )}
              </Box>
            </>
          )}
        </>
      ) : (
        <Typography variant="h6" component="p">
          Loading pages...
        </Typography>
      )}
    </Box>
  );
};

export default MangaPageContent;
