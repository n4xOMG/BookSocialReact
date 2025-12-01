import { Paper, Typography, useTheme, useMediaQuery } from "@mui/material";
import React from "react";

const TagBarItem = ({ tag, onClick, tagIndex, isSelected }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      onClick={() => onClick(tag)}
      elevation={isSelected ? 4 : 0}
      sx={{
        py: 1,
        px: 2.5,
        borderRadius: "50px", // Pill shape
        cursor: "pointer",
        transition: "all 0.3s ease",
        textAlign: "center",
        flexShrink: 0,
        minWidth: "auto",
        maxWidth: "200px",
        whiteSpace: "nowrap",
        bgcolor: isSelected 
          ? theme.palette.secondary.main
          : theme.palette.background.paper,
        border: "1px solid",
        borderColor: isSelected 
          ? theme.palette.secondary.main 
          : theme.palette.divider,
        color: isSelected ? theme.palette.secondary.contrastText : theme.palette.text.primary,
        transform: isSelected ? "translateY(-1px)" : "none",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: theme.palette.secondary.main,
          color: isSelected ? theme.palette.secondary.contrastText : theme.palette.secondary.main,
          boxShadow: theme.shadows[2],
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: isSelected ? 700 : 500,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "0.9rem",
        }}
      >
        {tag.name}
      </Typography>
    </Paper>
  );
};

export default TagBarItem;
