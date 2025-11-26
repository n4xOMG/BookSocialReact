import React from "react";
import { Chip } from "@mui/material";

export const FilterChip = ({ label, color = "primary", onDelete }) => {
  const isPrimary = color === "primary";

  return (
    <Chip
      label={label}
      size="small"
      onDelete={onDelete}
      sx={{
        borderRadius: "10px",
        fontWeight: 600,
        background: isPrimary ? "linear-gradient(135deg, #9d50bb, #6e48aa)" : "linear-gradient(135deg, #00c9a7, #56efca)",
        color: "#fff",
        border: "none",
        backdropFilter: "blur(8px)",
        "& .MuiChip-label": {
          px: 1.5,
          py: 0.25,
        },
        "& .MuiChip-deleteIcon": {
          color: "rgba(255, 255, 255, 0.8)",
          "&:hover": {
            color: "#fff",
          },
        },
      }}
    />
  );
};
