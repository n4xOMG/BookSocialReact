import { createTheme } from "@mui/material";
import darkBackground from "../assets/images/8.png";
import typography from "./typography";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
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
      default: "#0f0f1c",
      paper: "rgba(18, 18, 30, 0.45)",
      gradient: "linear-gradient(135deg, rgba(110, 72, 170, 0.15) 0%, rgba(157, 80, 187, 0.08) 100%)",
      title: "rgba(157, 80, 187, 0.4)",
      backgroundImage: `linear-gradient(rgba(15, 15, 28, 0.85), rgba(15, 15, 28, 0.85)), url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&q=80)`,
      backgroundAdminImage: `linear-gradient(rgba(15, 15, 28, 0.9), rgba(15, 15, 28, 0.9)), url(${darkBackground})`,
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.75)",
    },
    action: {
      hover: "rgba(157, 80, 187, 0.12)",
      selected: "rgba(157, 80, 187, 0.2)",
      notselect: "rgba(255, 255, 255, 0.05)",
      disabled: "rgba(255, 255, 255, 0.3)",
    },
    divider: "rgba(255, 255, 255, 0.08)",
  },
  typography: typography,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            borderColor: "rgba(157, 80, 187, 0.3)",
            boxShadow: "0 12px 40px 0 rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)",
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
          background: "linear-gradient(135deg, #9d50bb 0%, #6e48aa 100%)",
          color: "#fff",
          backdropFilter: "blur(15px)",
          boxShadow: "0 4px 16px rgba(157, 80, 187, 0.3)",
          "&:hover": {
            background: "linear-gradient(135deg, #b968c7 0%, #9d50bb 100%)",
            boxShadow: "0 6px 24px rgba(157, 80, 187, 0.5)",
            transform: "translateY(-2px)",
          },
        }),
        outlined: ({ theme }) => ({
          borderColor: "rgba(157, 80, 187, 0.5)",
          color: theme.palette.primary.main,
          backdropFilter: "blur(10px)",
          "&:hover": {
            borderColor: theme.palette.primary.main,
            backgroundColor: "rgba(157, 80, 187, 0.1)",
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
          background: "rgba(18, 18, 30, 0.65)",
          backdropFilter: "blur(30px) saturate(160%)",
          WebkitBackdropFilter: "blur(30px) saturate(160%)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "20px",
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(18, 18, 30, 0.45)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "16px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            borderColor: "rgba(157, 80, 187, 0.4)",
            transform: "translateY(-4px)",
            boxShadow: "0 16px 48px rgba(0, 0, 0, 0.6)",
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
