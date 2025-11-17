// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext();

export const useThemeMode = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeMode must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const location = useLocation();

    // Wczytaj preferencje z localStorage lub użyj domyślnie dark mode
    const [userMode, setUserMode] = useState(() => {
        const savedMode = localStorage.getItem('themeMode');
        return savedMode || 'dark';
    });

    // Zapisz preferencje do localStorage przy zmianie
    useEffect(() => {
        localStorage.setItem('themeMode', userMode);
    }, [userMode]);

    const toggleTheme = () => {
        setUserMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
    };

    // Sprawdź czy jesteśmy w dashboardzie - tylko tam może być light mode
    const isDashboard = location.pathname.startsWith('/dashboard');
    const mode = isDashboard ? userMode : 'dark';

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: '#00f0ff',
                        dark: '#00c0cc',
                        contrastText: mode === 'dark' ? '#121212' : '#ffffff',
                    },
                    secondary: {
                        main: mode === 'dark' ? '#b0b0b0' : '#757575',
                        light: '#ffffff',
                        contrastText: '#121212',
                    },
                    background: {
                        default: mode === 'dark' ? '#121212' : '#e8e8e8',
                        paper: mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                    },
                    text: {
                        primary: mode === 'dark' ? '#ffffff' : '#2c2c2c',
                        secondary: mode === 'dark' ? '#b0b0b0' : '#666666',
                    },
                    divider: mode === 'dark' ? '#333333' : '#d0d0d0',
                },
                typography: {
                    fontFamily: '"Poppins", sans-serif',
                    h1: {
                        fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                        fontWeight: 700,
                        lineHeight: 1.2,
                        color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
                    },
                    h2: {
                        fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                        fontWeight: 600,
                        marginBottom: '3rem',
                        color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
                    },
                    h3: {
                        fontSize: '1.4rem',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
                    },
                    body1: {
                        fontSize: '1rem',
                        lineHeight: 1.7,
                        fontWeight: 300,
                        color: mode === 'dark' ? '#b0b0b0' : '#666666',
                    },
                    body2: {
                        fontSize: '0.95rem',
                        color: mode === 'dark' ? '#b0b0b0' : '#666666',
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
                                color: mode === 'dark' ? '#121212' : '#ffffff',
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
                                    color: mode === 'dark' ? '#121212' : '#ffffff',
                                    borderWidth: '2px',
                                    transform: 'translateY(-2px)',
                                },
                            },
                        },
                    },
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                backgroundColor:
                                    mode === 'dark'
                                        ? 'rgba(18, 18, 18, 0.8)'
                                        : 'rgba(245, 245, 245, 0.9)',
                                backdropFilter: 'blur(10px)',
                                boxShadow:
                                    mode === 'dark'
                                        ? '0 2px 10px rgba(0, 0, 0, 0.3)'
                                        : '0 2px 10px rgba(0, 0, 0, 0.08)',
                                borderBottom:
                                    mode === 'dark' ? '1px solid #333333' : '1px solid #d0d0d0',
                            },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                backgroundColor: mode === 'dark' ? '#121212' : '#f5f5f5',
                                border:
                                    mode === 'dark' ? '1px solid #333333' : '1px solid #d0d0d0',
                                borderRadius: '10px',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow:
                                        mode === 'dark'
                                            ? '0 10px 20px rgba(0, 0, 0, 0.2)'
                                            : '0 10px 20px rgba(0, 0, 0, 0.08)',
                                },
                            },
                        },
                    },
                    MuiDrawer: {
                        styleOverrides: {
                            paper: {
                                backgroundColor: mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
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
            }),
        [mode, isDashboard]
    );

    const value = {
        mode,
        userMode,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
