import { createTheme } from "@mui/material";
import typography from "./typography";
import lightBackground from '../assets/images/9.png';
export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            light: '#4a8a75',
            main: '#1d6d53',
            dark: '#144c3a',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ffb6c1',
            main: '#ff6b81',
            dark: '#cd5c5c',
            contrastText: '#fff',
        },
        background: {
            default: '#f5f5f5',
            paper: 'rgba(255, 255, 255, 0.1)', 
            gradient: "linear-gradient(to right, rgba(29, 109, 83,0.4) 10%, rgba(29, 109, 83,0.2) 90%)",
            backgroundImage: `url(${lightBackground})`,
        },
        text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.54)',
        },
        action: {
        hover: 'rgba(0, 0, 0, 0.04)',
        selected: 'rgba(29, 109, 83, 0.4)',
        notselect: 'rgba(255, 255, 255, 0.3)',
        disabled: 'rgba(0, 0, 0, 0.26)',
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
                    },
                    '& .MuiInputLabel-root': {
                        color: theme.palette.text.secondary,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.2)',
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
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    color: theme.palette.text.primary,
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
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