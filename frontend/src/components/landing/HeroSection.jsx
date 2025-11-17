// src/components/landing/HeroSection.jsx
import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import HeroImage from '../../assets/images/heroimage.png';
import ParticlesBackground from '../common/ParticlesBackground';

const HeroSection = () => {
    // Animacje dla Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    const imageVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: 'easeOut',
            },
        },
    };

    const handleCTAClick = () => {
        const featuresSection = document.querySelector('#features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <Box
            id="hero"
            component="section"
            sx={{
                minHeight: { xs: 'auto', md: 'calc(90vh - 80px)' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(rgba(18, 18, 18, 0.8), rgba(18, 18, 18, 1))',
                pt: { xs: 10, md: 12 },
                pb: { xs: 8, md: 6 },
                px: { xs: 2, sm: 3 },
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Particles Background */}
            <ParticlesBackground />

            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: { xs: 4, md: 6 },
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Content (Left side) */}
                <Box
                    component={motion.div}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    sx={{
                        flex: 1,
                        maxWidth: { xs: '100%', md: '55%' },
                        textAlign: { xs: 'center', md: 'left' },
                    }}
                >
                    {/* Heading */}
                    <Typography
                        component={motion.h1}
                        variants={itemVariants}
                        variant="h1"
                        sx={{
                            mb: 3,
                            color: 'text.primary',
                        }}
                    >
                        Z nami zarządzanie pieniędzmi staje się proste.
                    </Typography>

                    {/* Subheading */}
                    <Typography
                        component={motion.p}
                        variants={itemVariants}
                        variant="body1"
                        sx={{
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            color: 'text.secondary',
                            mb: 4,
                            lineHeight: 1.6,
                        }}
                    >
                        Śledzenie wpływów, zarządzanie budżetem, zaoszczędź z SmartSaver.
                    </Typography>

                    {/* CTA Button */}
                    <Box component={motion.div} variants={itemVariants}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleCTAClick}
                            sx={{
                                fontSize: { xs: '0.95rem', sm: '1rem' },
                                px: { xs: 3, sm: 4 },
                                py: { xs: 1.2, sm: 1.5 },
                            }}
                        >
                            Zacznij oszczędzać teraz!
                        </Button>
                    </Box>
                </Box>

                {/* Image (Right side) */}
                <Box
                    component={motion.div}
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                    sx={{
                        flex: 1,
                        maxWidth: { xs: '100%', md: '40%' },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        component="img"
                        src={HeroImage}
                        alt="SmartSaver app mockups"
                        sx={{
                            maxWidth: { xs: '280px', sm: '350px', md: '400px' },
                            width: '100%',
                            height: 'auto',
                            opacity: 0.85,
                            filter: 'drop-shadow(0 10px 30px rgba(0, 240, 255, 0.2))',
                            transition: 'transform 0.3s ease, opacity 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                opacity: 1,
                            },
                        }}
                    />
                </Box>
            </Container>
        </Box>
    );
};

export default HeroSection;