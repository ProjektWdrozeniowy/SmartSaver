// src/components/landing/HowItWorksSection.jsx
import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Importuj obrazek
import howitworks1 from '../../assets/images/howitworks1.png';
import howitworks2 from '../../assets/images/howitworks2.png';

const HowItWorksSection = () => {
    const navigate = useNavigate();

    // Animacje
    const fadeInLeft = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.7, ease: 'easeOut' },
        },
    };

    const fadeInRight = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.7, ease: 'easeOut' },
        },
    };

    return (
        <Box component="section" id="how-it-works">
            {/* PIERWSZA SEKCJA - Tekst po lewej, obraz po prawej */}
            <Box
                sx={{
                    py: { xs: 6, md: 8 },
                    px: { xs: 2, sm: 3 },
                    backgroundColor: 'background.default',
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: { xs: 4, md: 6 },
                    }}
                >
                    {/* Content (Left) */}
                    <Box
                        component={motion.div}
                        variants={fadeInLeft}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        sx={{
                            flex: 1,
                            maxWidth: { xs: '100%', md: '45%' },
                            textAlign: { xs: 'center', md: 'left' },
                        }}
                    >
                        <Typography
                            variant="h2"
                            component="h2"
                            sx={{
                                fontSize: { xs: '1.8rem', md: '2.5rem' },
                                mb: 3,
                                textAlign: { xs: 'center', md: 'left' },
                            }}
                        >
                            Przejmij kontrolę nad finansami bez wysiłku.
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.secondary',
                                mb: 3,
                                lineHeight: 1.7,
                            }}
                        >
                            SmartSaver upraszcza zarządzanie pieniędzmi. Połącz konta, automatycznie
                            kategoryzuj wydatki i błyskawicznie wizualizuj swoją kondycję finansową.
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/signup')}
                            sx={{ mt: 1 }}
                        >
                            Dowiedz się więcej
                        </Button>
                    </Box>

                    {/* Image (Right) */}
                    <Box
                        component={motion.div}
                        variants={fadeInRight}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        sx={{
                            flex: 1,
                            maxWidth: { xs: '100%', md: '45%' },
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            component="img"
                            src={howitworks1}
                            alt="SmartSaver Dashboard"
                            sx={{
                                maxWidth: { xs: '100%', sm: '400px', md: '400px' },
                                width: '100%',
                                height: 'auto',
                                opacity: 0.85,
                            }}
                        />
                    </Box>
                </Container>
            </Box>

            {/* DRUGA SEKCJA - Obraz po lewej, tekst po prawej */}
            <Box
                sx={{
                    py: { xs: 6, md: 8 },
                    px: { xs: 2, sm: 3 },
                    backgroundColor: 'background.default',
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: { xs: 4, md: 6 },
                    }}
                >
                    {/* Image (Left) - na mobile będzie na górze */}
                    <Box
                        component={motion.div}
                        variants={fadeInLeft}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        sx={{
                            flex: 1,
                            maxWidth: { xs: '100%', md: '45%' },
                            display: 'flex',
                            justifyContent: 'center',
                            order: { xs: 1, md: 1 },
                        }}
                    >
                        <Box
                            component="img"
                            src={howitworks2}
                            alt="SmartSaver Analytics"
                            sx={{
                                maxWidth: { xs: '100%', sm: '400px', md: '400px' },
                                width: '100%',
                                height: 'auto',
                                opacity: 0.85,
                            }}
                        />
                    </Box>

                    {/* Content (Right) - na mobile będzie na dole */}
                    <Box
                        component={motion.div}
                        variants={fadeInRight}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        sx={{
                            flex: 1,
                            maxWidth: { xs: '100%', md: '45%' },
                            textAlign: { xs: 'center', md: 'left' },
                            order: { xs: 2, md: 2 },
                        }}
                    >
                        <Typography
                            variant="h2"
                            component="h2"
                            sx={{
                                fontSize: { xs: '1.8rem', md: '2.5rem' },
                                mb: 3,
                                textAlign: { xs: 'center', md: 'left' },
                            }}
                        >
                            Łatwa kategoryzacja i inteligentne analizy.
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.secondary',
                                mb: 3,
                                lineHeight: 1.7,
                            }}
                        >
                            Nasze inteligentne algorytmy pomagają kategoryzować transakcje, dostarczając
                            jasnych informacji o Twoich wzorcach wydatków i możliwościach oszczędzania.
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                const featuresSection = document.querySelector('#features');
                                if (featuresSection) {
                                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            sx={{ mt: 1 }}
                        >
                            Poznaj Funkcje
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default HowItWorksSection;