import { Box, Rating, Typography } from "@mui/material";

export const RatingComponent = ({ rating, onRate }) => (
  <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Rating name="simple-controlled" value={rating ? rating.rating : 0} onChange={(event, newValue) => onRate(newValue)} />
      <Typography sx={{ ml: 2, color: "gray.600" }}>{rating ? rating.rating : 0}</Typography>
    </Box>
  </Box>
);
