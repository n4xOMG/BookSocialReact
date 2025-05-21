import React from "react";
import { Box, Fade, Slider } from "@mui/material";

const MangaPageNavigation = ({ totalPages, viewMode, currentPage, handlePageChange }) => {
  const marks = Array.from({ length: totalPages }).map((_, index) => ({
    value: index,
  }));

  return (
    <>
      <Fade in>
        <Box sx={{ width: "100%", px: 2, bgcolor: "#212121" }} role="navigation" aria-label="Page navigation">
          <Slider
            value={currentPage}
            onChange={(event, value) => handlePageChange(value)}
            step={viewMode === "double" ? 2 : 1}
            marks={marks}
            min={0}
            max={totalPages - 1}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `Page ${value + 1}`}
            sx={{
              "& .MuiSlider-thumb": {
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "white" },
              },
              "& .MuiSlider-track": {
                bgcolor: "linear-gradient(45deg, grey.300, grey.500)",
              },
              "& .MuiSlider-rail": {
                bgcolor: "grey.300",
              },
              bottom: { xs: "5%", sm: "5%", md: "2%", lg: "2%" },
            }}
          />
          <Box sx={{ color: "white", textAlign: "center", mt: 1 }}>
            Page {currentPage + 1} / {totalPages}
          </Box>
        </Box>
      </Fade>
    </>
  );
};

export default MangaPageNavigation;
