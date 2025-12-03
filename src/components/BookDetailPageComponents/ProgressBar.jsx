import { Percent } from "@mui/icons-material";
import { Box, LinearProgress, Typography, useMediaQuery, useTheme } from "@mui/material";

export const ProgressBar = ({ progress }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  return (
    <Box sx={{ mb: isMobile ? 0 : 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: isMobile ? 2 : 3 }}>
        <Percent sx={{ mr: 1.5, color: theme.palette.secondary.main }} />
        <Typography
          variant="h5"
          sx={{
            textAlign: "left",
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
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
          bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
          backdropFilter: "blur(8px)",
          border: "1px solid",
          borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          "& .MuiLinearProgress-bar": {
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            borderRadius: "12px",
            boxShadow: `0 0 20px ${theme.palette.primary.main}66`,
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
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
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
