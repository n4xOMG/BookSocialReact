import { Box } from "@mui/material";

export default function InfoBox({ children, sx = {}, ...props }) {
  return (
    <Box
      {...props}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2.5,
        backgroundColor: "background.paper",
        transition: "all 0.25s ease",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",

        "&:hover": {
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          borderColor: "primary.main",
          transform: "translateY(-2px)",
        },

        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
