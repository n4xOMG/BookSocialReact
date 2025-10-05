import { Percent } from "@mui/icons-material";
import { Box, Divider, LinearProgress, Typography, useMediaQuery } from "@mui/material";

export const ProgressBar = ({ progress }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return (
    <Box sx={{ mb: isMobile ? 0 : 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: isMobile ? 3 : 5 }}>
        <Percent sx={{ mr: 1.5 }}/>
      <Typography variant="h5" sx={{ textAlign: "left", fontWeight: "bold" }}>
        Overall Progress
      </Typography>
      </Box>
      
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
  )
};
