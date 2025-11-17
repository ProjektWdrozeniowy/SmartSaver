// src/components/common/Navbar.jsx
import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Linki nawigacyjne
    const navLinks = [
        { label: 'Start', href: '#hero' },
        { label: 'Funkcje', href: '#features' },
        { label: 'Jak to działa?', href: '#how-it-works' },
    ];

    // Smooth scroll do sekcji
    const handleNavClick = (href) => {
        setDrawerOpen(false);

        if (href.startsWith('#')) {
            // Jeśli NIE jesteśmy na stronie głównej, najpierw przekieruj
            if (location.pathname !== '/') {
                navigate('/', { state: { scrollTo: href } });
            } else {
                // Jeśli jesteśmy na głównej, po prostu scrolluj
                const element = document.querySelector(href);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    // Toggle drawer
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    // Drawer content (mobile menu)
    const drawerContent = (
        <Box
            sx={{
                width: 280,
                height: '100%',
                backgroundColor: 'background.paper',
                pt: 3,
            }}
            role="presentation"
        >
            {/* Close button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, pb: 2 }}>
                <IconButton onClick={toggleDrawer(false)} sx={{ color: 'text.primary' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Navigation Links */}
            <List>
                {navLinks.map((link) => (
                    <ListItem key={link.label} disablePadding>
                        <ListItemButton
                            onClick={() => handleNavClick(link.href)}
                            sx={{
                                py: 2,
                                px: 3,
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 240, 255, 0.1)',
                                },
                            }}
                        >
                            <ListItemText
                                primary={link.label}
                                sx={{
                                    color: 'text.secondary',
                                    '& .MuiTypography-root': {
                                        fontWeight: 400,
                                    },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* Action Buttons (mobile) */}
            <Box sx={{ px: 3, pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                    variant="text"
                    onClick={() => {
                        setDrawerOpen(false);
                        navigate('/signin');
                    }}
                    sx={{
                        color: 'text.secondary',
                        '&:hover': {
                            color: 'text.primary',
                        },
                    }}
                >
                    Zaloguj
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        setDrawerOpen(false);
                        navigate('/signup');
                    }}
                >
                    Zarejestruj się
                </Button>
            </Box>
        </Box>
    );

    return (
        <>
            <AppBar position="sticky" elevation={0}>
                <Toolbar
                    sx={{
                        maxWidth: '1300px',
                        width: '100%',
                        margin: '0 auto',
                        justifyContent: 'space-between',
                        px: { xs: 2, sm: 3 },
                    }}
                >
                    {/* Logo */}
                    <Box
                        component={Link}
                        to="/"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        sx={{
                            fontSize: { xs: '1.5rem', sm: '1.8rem' },
                            fontWeight: 700,
                            color: 'text.primary',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                                color: 'primary.main',
                            },
                        }}
                    >
                        Smart
                        <Box
                            component="span"
                            sx={{
                                color: 'primary.main',
                                fontSize: '1.2em',
                                fontWeight: 700,
                            }}
                        >
                            $
                        </Box>
                        aver
                    </Box>

                    {/* Desktop Navigation */}
                    {!isMobile ? (
                        <>
                            {/* Center Links */}
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                {navLinks.map((link) => (
                                    <Box
                                        key={link.label}
                                        component="a"
                                        href={link.href}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavClick(link.href);
                                        }}
                                        sx={{
                                            color: 'text.secondary',
                                            textDecoration: 'none',
                                            fontWeight: 400,
                                            fontSize: '1rem',
                                            position: 'relative',
                                            padding: '0.5rem 0.2rem',
                                            cursor: 'pointer',
                                            transition: 'color 0.3s ease',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                width: 0,
                                                height: '2px',
                                                bottom: '-2px',
                                                left: 0,
                                                backgroundColor: 'primary.main',
                                                transition: 'width 0.3s ease',
                                            },
                                            '&:hover': {
                                                color: 'text.primary',
                                                '&::after': {
                                                    width: '100%',
                                                },
                                            },
                                        }}
                                    >
                                        {link.label}
                                    </Box>
                                ))}
                            </Box>

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Button
                                    variant="text"
                                    onClick={() => navigate('/signin')}
                                    sx={{
                                        color: 'text.secondary',
                                        position: 'relative',
                                        fontWeight: 400,
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            width: 0,
                                            height: '2px',
                                            bottom: '4px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            backgroundColor: 'primary.main',
                                            transition: 'width 0.3s ease',
                                        },
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            color: 'text.primary',
                                            '&::after': {
                                                width: '80%',
                                            },
                                        },
                                    }}
                                >
                                    Zaloguj
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/signup')}
                                >
                                    Zarejestruj się
                                </Button>
                            </Box>
                        </>
                    ) : (
                        // Mobile Hamburger
                        <IconButton
                            edge="end"
                            onClick={toggleDrawer(true)}
                            sx={{
                                color: 'text.primary',
                                ml: 2,
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        backgroundColor: 'background.paper',
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Navbar;