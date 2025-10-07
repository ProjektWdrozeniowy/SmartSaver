// src/components/landing/BottomCTA.jsx
import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BottomCTA = () => {
    const navigate = useNavigate();

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    return (
        <Box
            id="bottom-cta"
            component="section"
            sx={{
                py: { xs: 8, md: 10 },
                px: { xs: 2, sm: 3 },
                background: 'linear-gradient(45deg, #0d1a2a, #1a0d1f)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Animated background elements (opcjonalnie) */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                    background: 'radial-gradient(circle at 20% 50%, #00f0ff 0%, transparent 50%)',
                }}
            />

            <Container
                maxWidth="md"
                component={motion.div}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                sx={{ position: 'relative', zIndex: 1 }}
            >
                {/* Heading */}
                <Typography
                    component={motion.h2}
                    variants={fadeInUp}
                    variant="h2"
                    sx={{
                        color: 'text.primary',
                        mb: 3,
                    }}
                >
                    Gotów przejąć kontrolę?
                </Typography>

                {/* Description */}
                <Typography
                    component={motion.p}
                    variants={fadeInUp}
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        mb: 4,
                        maxWidth: '600px',
                        margin: '0 auto 2rem auto',
                        lineHeight: 1.7,
                    }}
                >
                    Zarejestruj się w SmartSaver już dziś i rozpocznij swoją podróż ku wolności
                    finansowej.
                </Typography>

                {/* CTA Button */}
                <Box component={motion.div} variants={fadeInUp}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/signup')}
                        sx={{
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            px: { xs: 3, sm: 5 },
                            py: { xs: 1.3, sm: 1.6 },
                        }}
                    >
                        Zarejestruj się za darmo
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default BottomCTA;