import { createTheme } from "@mui/material";
import darkBackground from "../assets/images/8.png";
import typography from "./typography";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#546e7a",
      main: "#455a64",
      dark: "#263238",
      contrastText: "#fff",
    },
    secondary: {
      light: "#e0c080",
      main: "#c5a065",
      dark: "#aa8a55",
      contrastText: "#1a252f",
    },
    accent: {
      coral: "#cd5c5c",
      gold: "#d4af37",
    },
    background: {
      default: "#1a2634", // Deep Charcoal/Navy
      paper: "rgba(26, 38, 52, 0.75)",
      gradient: "linear-gradient(135deg, rgba(44, 62, 80, 0.15) 0%, rgba(26, 38, 52, 0.08) 100%)",
      title: "rgba(197, 160, 101, 0.2)",
      backgroundImage: `linear-gradient(rgba(26, 38, 52, 0.85), rgba(26, 38, 52, 0.85)), url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&q=80)`,
      backgroundAdminImage: `linear-gradient(rgba(26, 38, 52, 0.9), rgba(26, 38, 52, 0.9)), url(${darkBackground})`,
    },
    text: {
      primary: "#e0e0e0", // Off-white / Parchment
      secondary: "rgba(255, 255, 255, 0.7)",
    },
    action: {
      hover: "rgba(197, 160, 101, 0.08)",
      selected: "rgba(197, 160, 101, 0.15)",
      notselect: "rgba(255, 255, 255, 0.05)",
      disabled: "rgba(255, 255, 255, 0.3)",
    },
    divider: "rgba(255, 255, 255, 0.1)",
  },
  typography: typography,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          border: "1px solid rgba(197, 160, 101, 0.15)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            borderColor: "rgba(197, 160, 101, 0.3)",
            boxShadow: "0 12px 40px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
          },
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiInputBase-input": {
            color: theme.palette.text.primary,
            "&::placeholder": {
              color: theme.palette.text.primary,
              opacity: 1,
            },
          },
          "& .MuiInputAdornment-root .MuiSvgIcon-root": {
            color: theme.palette.text.primary,
          },
          "& .MuiInputLabel-root": {
            color: theme.palette.text.secondary,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.3)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.text.primary,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 600,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
        contained: ({ theme }) => ({
          background: theme.palette.primary.main,
          color: "#fff",
          backdropFilter: "blur(15px)",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
          "&:hover": {
            background: theme.palette.primary.light,
            boxShadow: "0 6px 24px rgba(0, 0, 0, 0.4)",
            transform: "translateY(-2px)",
          },
        }),
        outlined: ({ theme }) => ({
          borderColor: "rgba(197, 160, 101, 0.4)",
          color: theme.palette.secondary.main,
          backdropFilter: "blur(10px)",
          "&:hover": {
            borderColor: theme.palette.secondary.main,
            backgroundColor: "rgba(197, 160, 101, 0.08)",
          },
        }),
      },
    },
    MuiLink: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: "rgba(26, 38, 52, 0.85)",
          backdropFilter: "blur(30px) saturate(160%)",
          WebkitBackdropFilter: "blur(30px) saturate(160%)",
          border: "1px solid rgba(197, 160, 101, 0.15)",
          borderRadius: "20px",
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(26, 38, 52, 0.65)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(197, 160, 101, 0.1)",
          borderRadius: "16px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            borderColor: "rgba(197, 160, 101, 0.3)",
            transform: "translateY(-4px)",
            boxShadow: "0 16px 48px rgba(0, 0, 0, 0.5)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          fontWeight: 500,
        },
      },
    },
  },
});
