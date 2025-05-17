import React from "react";
import { Chip } from "@mui/material";

export const FilterChip = ({ label, color = "primary", onDelete }) => {
  return (
    <Chip
      label={label}
      size="small"
      color={color}
      onDelete={onDelete}
      sx={{
        borderRadius: 1,
        "& .MuiChip-label": {
          px: 1,
          py: 0.25,
        },
      }}
    />
  );
};
