import { createTheme } from "@mui/material";
import lightBackground from "../assets/images/9.png";
import typography from "./typography";
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#34495e",
      main: "#2c3e50",
      dark: "#1a252f",
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
      default: "#fdfbf7", // Warm paper
      paper: "rgba(255, 255, 255, 0.65)",
      gradient: "linear-gradient(135deg, rgba(44, 62, 80, 0.05) 0%, rgba(197, 160, 101, 0.05) 100%)",
      title: "rgba(44, 62, 80, 0.1)",
      backgroundImage: `linear-gradient(rgba(253, 251, 247, 0.85), rgba(253, 251, 247, 0.85)), url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&q=80)`,
      backgroundAdminImage: `linear-gradient(rgba(253, 251, 247, 0.9), rgba(253, 251, 247, 0.9)), url(${lightBackground})`,
    },
    text: {
      primary: "#2c3e50",
      secondary: "rgba(44, 62, 80, 0.7)",
    },
    action: {
      hover: "rgba(44, 62, 80, 0.05)",
      selected: "rgba(44, 62, 80, 0.1)",
      notselect: "rgba(0, 0, 0, 0.05)",
      disabled: "rgba(0, 0, 0, 0.26)",
    },
    divider: "rgba(44, 62, 80, 0.1)",
  },
  typography: typography,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(44, 62, 80, 0.1)",
          borderRadius: "16px",
          boxShadow: "0 4px 20px 0 rgba(44, 62, 80, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            borderColor: "rgba(197, 160, 101, 0.3)",
            boxShadow: "0 12px 32px 0 rgba(44, 62, 80, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.6)",
          },
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiInputBase-input": {
            color: theme.palette.text.primary,
          },
          "& .MuiInputLabel-root": {
            color: theme.palette.text.secondary,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.2)",
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
          boxShadow: "0 4px 12px rgba(44, 62, 80, 0.2)",
          "&:hover": {
            background: theme.palette.primary.light,
            boxShadow: "0 6px 20px rgba(44, 62, 80, 0.3)",
            transform: "translateY(-2px)",
          },
        }),
        outlined: ({ theme }) => ({
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
          backdropFilter: "blur(10px)",
          "&:hover": {
            borderColor: theme.palette.primary.dark,
            backgroundColor: "rgba(44, 62, 80, 0.05)",
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
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(30px) saturate(180%)",
          WebkitBackdropFilter: "blur(30px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          borderRadius: "20px",
          boxShadow: "0 24px 80px rgba(44, 62, 80, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.65)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(44, 62, 80, 0.1)",
          borderRadius: "16px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            borderColor: "rgba(197, 160, 101, 0.4)",
            transform: "translateY(-4px)",
            boxShadow: "0 16px 48px rgba(44, 62, 80, 0.1)",
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
