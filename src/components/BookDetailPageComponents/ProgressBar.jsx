import { Percent } from "@mui/icons-material";
import { Box, Divider, LinearProgress, Typography, useMediaQuery } from "@mui/material";

export const ProgressBar = ({ progress }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return (
    <Box sx={{ mb: isMobile ? 0 : 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: isMobile ? 2 : 3 }}>
        <Percent sx={{ mr: 1.5, color: "#9d50bb" }} />
        <Typography
          variant="h5"
          sx={{
            textAlign: "left",
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Overall Progress
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          width: "100%",
          height: isMobile ? 10 : 12,
          borderRadius: "12px",
          background: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"),
          backdropFilter: "blur(8px)",
          border: "1px solid",
          borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"),
          overflow: "hidden",
          "& .MuiLinearProgress-bar": {
            background: "linear-gradient(90deg, #00c9a7, #56efca, #84fab0)",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(0, 201, 167, 0.4)",
            backgroundSize: "200% 100%",
          },
        }}
      />
      <Typography
        sx={{
          textAlign: "right",
          mt: 1.5,
          fontWeight: 700,
          fontSize: "1rem",
          background: "linear-gradient(135deg, #00c9a7, #56efca)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {progress}% Complete
      </Typography>
    </Box>
  );
};
