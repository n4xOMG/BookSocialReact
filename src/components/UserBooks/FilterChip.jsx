import React from "react";
import { Chip } from "@mui/material";

export const FilterChip = ({ label, color = "primary", onDelete }) => {
  return (
    <Chip
      label={label}
      size="small"
      onDelete={onDelete}
      sx={{
        borderRadius: "6px",
        fontWeight: 600,
        fontSize: "0.75rem",
        bgcolor: color === "primary" ? "primary.light" : "secondary.light",
        color: color === "primary" ? "primary.contrastText" : "secondary.contrastText",
        "& .MuiChip-deleteIcon": {
          color: "inherit",
          opacity: 0.7,
          "&:hover": { opacity: 1 },
        },
      }}
    />
  );
};
