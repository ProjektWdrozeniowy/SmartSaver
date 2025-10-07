// src/assets/styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00f0ff', // accent-teal
            dark: '#00c0cc', // accent-teal-darker
            contrastText: '#121212',
        },
        secondary: {
            main: '#b0b0b0', // text-secondary
            light: '#ffffff',
            contrastText: '#121212',
        },
        background: {
            default: '#121212', // background-dark
            paper: '#1a1a1a',   // background-light-dark
        },
        text: {
            primary: '#ffffff',   // text-primary
            secondary: '#b0b0b0', // text-secondary
        },
        divider: '#333333', // border-color
    },
    typography: {
        fontFamily: '"Poppins", sans-serif',
        h1: {
            fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            color: '#ffffff',
        },
        h2: {
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 600,
            marginBottom: '3rem',
            color: '#ffffff',
        },
        h3: {
            fontSize: '1.4rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
            color: '#ffffff',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.7,
            fontWeight: 300,
            color: '#b0b0b0',
        },
        body2: {
            fontSize: '0.95rem',
            color: '#b0b0b0',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '30px',
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '0.8rem 2rem',
                    transition: 'all 0.3s ease',
                },
                contained: {
                    backgroundColor: '#00f0ff',
                    color: '#121212',
                    boxShadow: '0 0 10px 2px rgba(0, 240, 255, 0)',
                    '&:hover': {
                        backgroundColor: '#00c0cc',
                        transform: 'translateY(-3px) scale(1.03)',
                        boxShadow: '0 0 20px 8px rgba(0, 240, 255, 0.3)',
                    },
                },
                outlined: {
                    borderColor: '#00f0ff',
                    color: '#00f0ff',
                    borderWidth: '2px',
                    '&:hover': {
                        backgroundColor: '#00f0ff',
                        color: '#121212',
                        borderWidth: '2px',
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(18, 18, 18, 0.8)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                    borderBottom: '1px solid #333333',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#121212',
                    border: '1px solid #333333',
                    borderRadius: '10px',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                    },
                },
            },
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

export default theme;