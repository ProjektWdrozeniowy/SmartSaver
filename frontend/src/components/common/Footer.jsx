// src/components/common/Footer.jsx
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#0a0a0a',
                color: 'text.secondary',
                py: 3,
                px: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                mt: 'auto',
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                {/* Copyright */}
                <Typography
                    variant="body2"
                    sx={{
                        fontSize: '0.9rem',
                        textAlign: { xs: 'center', sm: 'left' },
                        color: 'text.primary',
                    }}
                >
                    © {currentYear} Smart
                    <Box
                        component="span"
                        sx={{
                            color: 'primary.main',
                            fontSize: '1.1em',
                            fontWeight: 700,
                        }}
                    >
                        $
                    </Box>
                    aver. Wszelkie prawa zastrzeżone.
                </Typography>

                {/* Links */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: { xs: 2, sm: 3 },
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        component={Link}
                        to="/terms"
                        sx={{
                            color: 'text.secondary',
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                            transition: 'color 0.3s ease',
                            '&:hover': {
                                color: 'primary.main',
                            },
                        }}
                    >
                        Regulamin
                    </Box>
                    <Box
                        component={Link}
                        to="/privacy-policy"
                        sx={{
                            color: 'text.secondary',
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                            transition: 'color 0.3s ease',
                            '&:hover': {
                                color: 'primary.main',
                            },
                        }}
                    >
                        Polityka Prywatności
                    </Box>
                    <Box
                        component={Link}
                        to="/terms-of-service"
                        sx={{
                            color: 'text.secondary',
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                            transition: 'color 0.3s ease',
                            '&:hover': {
                                color: 'primary.main',
                            },
                        }}
                    >
                        Warunki Usługi
                    </Box>
                    <Box
                        component={Link}
                        to="/contact"
                        sx={{
                            color: 'text.secondary',
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                            transition: 'color 0.3s ease',
                            '&:hover': {
                                color: 'primary.main',
                            },
                        }}
                    >
                        Kontakt
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;