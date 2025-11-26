import { createTheme } from "@mui/material";
import lightBackground from "../assets/images/9.png";
import typography from "./typography";
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#b968c7",
      main: "#9d50bb",
      dark: "#6e48aa",
      contrastText: "#fff",
    },
    secondary: {
      light: "#84fab0",
      main: "#56efca",
      dark: "#00c9a7",
      contrastText: "#12121e",
    },
    accent: {
      coral: "#ff6b6b",
      gold: "#ffd700",
    },
    background: {
      default: "#f8f7f4",
      paper: "rgba(255, 255, 255, 0.22)",
      gradient: "linear-gradient(135deg, rgba(157, 80, 187, 0.08) 0%, rgba(0, 201, 167, 0.05) 100%)",
      title: "rgba(110, 72, 170, 0.15)",
      backgroundImage: `linear-gradient(rgba(248, 247, 244, 0.75), rgba(248, 247, 244, 0.75)), url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80)`,
      backgroundAdminImage: `linear-gradient(rgba(248, 247, 244, 0.85), rgba(248, 247, 244, 0.85)), url(${lightBackground})`,
    },
    text: {
      primary: "rgba(18, 18, 30, 0.92)",
      secondary: "rgba(18, 18, 30, 0.65)",
    },
    action: {
      hover: "rgba(157, 80, 187, 0.08)",
      selected: "rgba(157, 80, 187, 0.15)",
      notselect: "rgba(0, 0, 0, 0.05)",
      disabled: "rgba(0, 0, 0, 0.26)",
    },
    divider: "rgba(18, 18, 30, 0.08)",
  },
  typography: typography,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.35)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px 0 rgba(18, 18, 30, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            borderColor: "rgba(157, 80, 187, 0.35)",
            boxShadow: "0 12px 40px 0 rgba(18, 18, 30, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)",
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
          background: "linear-gradient(135deg, #9d50bb 0%, #6e48aa 100%)",
          color: "#fff",
          backdropFilter: "blur(15px)",
          boxShadow: "0 4px 16px rgba(157, 80, 187, 0.25)",
          "&:hover": {
            background: "linear-gradient(135deg, #b968c7 0%, #9d50bb 100%)",
            boxShadow: "0 6px 24px rgba(157, 80, 187, 0.4)",
            transform: "translateY(-2px)",
          },
        }),
        outlined: ({ theme }) => ({
          borderColor: "rgba(157, 80, 187, 0.4)",
          color: theme.palette.primary.main,
          backdropFilter: "blur(10px)",
          "&:hover": {
            borderColor: theme.palette.primary.main,
            backgroundColor: "rgba(157, 80, 187, 0.08)",
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
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(30px) saturate(180%)",
          WebkitBackdropFilter: "blur(30px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          borderRadius: "20px",
          boxShadow: "0 24px 80px rgba(18, 18, 30, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.22)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.35)",
          borderRadius: "16px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            borderColor: "rgba(157, 80, 187, 0.4)",
            transform: "translateY(-4px)",
            boxShadow: "0 16px 48px rgba(18, 18, 30, 0.12)",
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
