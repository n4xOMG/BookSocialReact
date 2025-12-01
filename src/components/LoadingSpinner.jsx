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
          background: theme.palette.background.paper,
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: theme.palette.divider,
          borderRadius: "16px",
          boxShadow: theme.shadows[4],
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
