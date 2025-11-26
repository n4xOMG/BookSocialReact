import { Box, CircularProgress, useTheme } from "@mui/material";
import React from "react";

const LoadingSpinner = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "200px",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "80px",
          height: "80px",
          background: theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.45)" : "rgba(255, 255, 255, 0.22)",
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.35)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        }}
      >
        <CircularProgress
          size={40}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default LoadingSpinner;
