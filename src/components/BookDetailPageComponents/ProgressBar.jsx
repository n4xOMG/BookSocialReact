import { Box, LinearProgress, Typography } from "@mui/material";

export const ProgressBar = ({ progress }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="h5" sx={{ mb: 2, textAlign: "left", fontWeight: "bold" }}>
      Overall Progress
    </Typography>
    <LinearProgress
      variant="determinate"
      value={progress}
      sx={{
        width: "100%",
        "& .MuiLinearProgress-root": {
          backgroundColor: "gray",
        },
        "& .MuiLinearProgress-bar": {
          backgroundColor: "black",
        },
      }}
    />
    <Typography sx={{ textAlign: "right", color: "gray.600", mt: 1 }}>{progress}% Complete</Typography>
  </Box>
);
