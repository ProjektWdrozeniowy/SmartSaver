// src/components/landing/TestimonialsSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, Card, CardContent, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

const TestimonialsSection = () => {
    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef(null);

    // Dane opinii
    const testimonials = [
        {
            name: 'Agnieszka Pawlak',
            initials: 'AP',
            color: '#ff6b9d',
            text: 'SmartSaver zmienił sposób, w jaki zarządzam pieniędzmi. Jest intuicyjny i potężny!',
        },
        {
            name: 'Zofia Kowalska',
            initials: 'ZK',
            color: '#4ecdc4',
            text: 'W końcu aplikacja budżetowa, która ma sens. Raporty są niezwykle pomocne.',
        },
        {
            name: 'Mateusz Rutkowski',
            initials: 'MR',
            color: '#ffd93d',
            text: 'Czuję znacznie większą kontrolę nad swoimi finansami, odkąd zacząłem używać SmartSaver.',
        },
        {
            name: 'Karolina Wiśniewska',
            initials: 'KW',
            color: '#a8e6cf',
            text: 'Automatyczna kategoryzacja wydatków oszczędza mi mnóstwo czasu. Genialny pomysł!',
        },
        {
            name: 'Piotr Nowak',
            initials: 'PN',
            color: '#c7ceea',
            text: 'Dzięki SmartSaver w końcu mogę śledzić swoje cele oszczędnościowe. Polecam każdemu!',
        },
        {
            name: 'Anna Lewandowska',
            initials: 'AL',
            color: '#ffb4a2',
            text: 'Najlepsza aplikacja finansowa, jakiej używałam. Prosta, elegancka i bardzo funkcjonalna.',
        },
        {
            name: 'Tomasz Zieliński',
            initials: 'TZ',
            color: '#b5ead7',
            text: 'Wreszcie wiem, na co wydaję pieniądze! SmartSaver dał mi pełną transparentność finansową.',
        },
        {
            name: 'Magdalena Kamińska',
            initials: 'MK',
            color: '#e2b0ff',
            text: 'Intuicyjny interfejs i świetne raporty. SmartSaver to must-have dla każdego!',
        },
    ];

    // Duplikujemy tablicę 3x dla płynnego zapętlenia
    const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

    return (
        <Box
            id="testimonials"
            component="section"
            sx={{
                py: { xs: 8, md: 10 },
                px: 0,
                backgroundColor: 'background.paper',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                {/* Section Title */}
                <Typography
                    variant="h2"
                    component="h2"
                    sx={{
                        textAlign: 'center',
                        mb: 6,
                    }}
                >
                    Co mówią nasi użytkownicy
                </Typography>
            </Container>

            {/* Scrolling Container */}
            <Box
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    position: 'relative',
                    py: 1, // Dodatkowy padding dla całego kontenera
                    '&:hover .scrolling-wrapper': {
                        animationPlayState: 'paused',
                    },
                }}
            >
                {/* Gradient overlays po bokach */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100px',
                        height: '100%',
                        background: 'linear-gradient(to right, #1a1a1a, transparent)',
                        zIndex: 2,
                        pointerEvents: 'none',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '100px',
                        height: '100%',
                        background: 'linear-gradient(to left, #1a1a1a, transparent)',
                        zIndex: 2,
                        pointerEvents: 'none',
                    }}
                />

                {/* Scrolling Wrapper */}
                <Box
                    className="scrolling-wrapper"
                    sx={{
                        display: 'flex',
                        gap: 3,
                        width: 'fit-content',
                        py: 2, // Dodajemy padding pionowy dla efektu hover
                        animation: 'scroll 40s linear infinite',
                        '@keyframes scroll': {
                            '0%': {
                                transform: 'translateX(0)',
                            },
                            '100%': {
                                transform: `translateX(calc(-${(testimonials.length * 310)}px))`,
                            },
                        },
                        '&:hover': {
                            animationPlayState: 'paused',
                        },
                    }}
                >
                    {duplicatedTestimonials.map((testimonial, index) => (
                        <Box
                            key={index}
                            sx={{
                                minWidth: '280px',
                                maxWidth: '280px',
                            }}
                        >
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backgroundColor: 'rgba(30, 30, 30, 0.7)',
                                    backdropFilter: 'blur(5px)',
                                    p: 2,
                                    transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: 'rgba(40, 40, 40, 0.9)',
                                        boxShadow: `0 0 20px 3px ${testimonial.color}50`,
                                    },
                                }}
                            >
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 2,
                                        textAlign: 'center',
                                    }}
                                >
                                    {/* Avatar */}
                                    <Avatar
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            backgroundColor: testimonial.color,
                                            color: '#121212',
                                            fontSize: '1.3rem',
                                            fontWeight: 600,
                                            boxShadow: `0 0 15px 3px ${testimonial.color}50`,
                                        }}
                                    >
                                        {testimonial.initials}
                                    </Avatar>

                                    {/* Quote */}
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontStyle: 'italic',
                                            color: 'text.secondary',
                                            lineHeight: 1.6,
                                            minHeight: '80px',
                                        }}
                                    >
                                        "{testimonial.text}"
                                    </Typography>

                                    {/* Name */}
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 600,
                                            color: 'text.primary',
                                            mt: 'auto',
                                        }}
                                    >
                                        - {testimonial.name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Informacja dla użytkownika */}
            <Box
                sx={{
                    textAlign: 'center',
                    mt: 4,
                    px: { xs: 2, sm: 3 },
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        fontSize: '0.85rem',
                        fontStyle: 'italic',
                    }}
                >
                    Najedź na kartę, aby zatrzymać przewijanie
                </Typography>
            </Box>
        </Box>
    );
};

export default TestimonialsSection;