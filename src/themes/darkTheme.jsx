import { createTheme } from "@mui/material";
import typography from "./typography";
import darkBackground from '../assets/images/8.png';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#FFF59D',
      main: '#FFEB3B',
      dark: '#FBC02D',
      contrastText: '#000',
    },
    secondary: {
      light: '#FFCC80',
      main: '#FF9800',
      dark: '#E65100',
      contrastText: '#fff',
    },
    background: {
      default: '#121212', 
      paper: 'rgba(255, 255, 255, 0.01)',
      gradient:  'rgba(252, 231, 43, 0.3)',
      backgroundImage: `url(${darkBackground})`,
    },
    text: {
      primary: '#fff', 
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    action: {
      hover: 'rgba(255, 255, 255, 0.08)', 
      selected: 'rgba(29, 109, 83, 0.16)', 
      notselect: 'rgba(0, 0, 0, 0.3)',
      disabled: 'rgba(255, 255, 255, 0.3)',
    },
  },
  typography: typography,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)', 
          borderRadius: '15px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiInputBase-input': {
            color: theme.palette.text.primary,
            '&::placeholder': {
              color: theme.palette.text.primary,
              opacity: 1, 
            },
          },
          '& .MuiInputAdornment-root .MuiSvgIcon-root': {
            color: theme.palette.text.primary,
          },
          '& .MuiInputLabel-root': {
            color: theme.palette.text.secondary,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.3)', 
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.primary,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: ({ theme }) => ({
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
  },
});