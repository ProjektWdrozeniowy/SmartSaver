// src/components/landing/FeaturesSection.jsx
import React from 'react';
import { Box, Typography, Container, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';

const FeaturesSection = () => {
    // Dane funkcji
    const features = [
        {
            icon: <AccountBalanceWalletIcon sx={{ fontSize: 30 }} />,
            title: 'Śledzenie Wydatków',
            description: 'Łatwo monitoruj, gdzie trafiają Twoje pieniądze w czasie rzeczywistym.',
        },
        {
            icon: <TrendingUpIcon sx={{ fontSize: 30 }} />,
            title: 'Planowanie Budżetu',
            description: 'Ustalaj cele finansowe i trzymaj się planu dzięki spersonalizowanym budżetom.',
        },
        {
            icon: <AssessmentIcon sx={{ fontSize: 30 }} />,
            title: 'Wnikliwe Raporty',
            description: 'Generuj szczegółowe raporty, aby zrozumieć swoje nawyki wydatkowe.',
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 30 }} />,
            title: 'Bezpieczeństwo Danych',
            description: 'Twoje dane finansowe są szyfrowane i bezpiecznie przechowywane.',
        },
    ];

    // Animacje
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    return (
        <Box
            id="features"
            component="section"
            sx={{
                py: { xs: 8, md: 10 },
                px: { xs: 2, sm: 3 },
                backgroundColor: 'background.paper',
            }}
        >
            <Container maxWidth="lg">
                {/* Section Title */}
                <Typography
                    variant="h2"
                    component="h2"
                    sx={{
                        textAlign: 'center',
                        mb: 6,
                    }}
                >
                    Kluczowe Funkcje
                </Typography>

                {/* Features Container - FLEXBOX */}
                <Box
                    component={motion.div}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' }, // Kolumna na mobile, rząd na desktop
                        gap: { xs: 3, md: 2.5 },
                        justifyContent: 'center',
                        alignItems: { xs: 'center', md: 'stretch' },
                        maxWidth: '1200px',
                        margin: '0 auto',
                    }}
                >
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            component={motion.div}
                            variants={cardVariants}
                            sx={{
                                flex: { xs: '0 0 auto', md: '1 1 0' }, // Na desktop: równe szerokości
                                width: { xs: '100%', sm: '80%', md: 'auto' }, // Mobile: pełna szerokość
                                maxWidth: { xs: '400px', md: 'none' },
                                display: 'flex',
                                flexDirection: 'column',
                                textAlign: 'center',
                                p: 2,
                            }}
                        >
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2,
                                    flex: 1,
                                }}
                            >
                                {/* Icon */}
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        backgroundColor: 'primary.main',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'primary.contrastText',
                                        boxShadow: '0 0 15px 3px rgba(0, 240, 255, 0.3)',
                                        mb: 1,
                                    }}
                                >
                                    {feature.icon}
                                </Box>

                                {/* Title */}
                                <Typography
                                    variant="h3"
                                    component="h3"
                                    sx={{
                                        fontSize: '1.3rem',
                                        fontWeight: 600,
                                        color: 'text.primary',
                                    }}
                                >
                                    {feature.title}
                                </Typography>

                                {/* Description */}
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.95rem',
                                    }}
                                >
                                    {feature.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default FeaturesSection;