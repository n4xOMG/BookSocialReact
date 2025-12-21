import { Box, CircularProgress, useTheme } from "@mui/material";
import React from "react";

const LoadingSpinner = ({ fullscreen = false }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: fullscreen ? "fixed" : "absolute",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={32} thickness={4} />
      </Box>
    </Box>
  );
};


export default LoadingSpinner;
