// src/components/landing/QuotesSection.jsx
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const QuotesSection = () => {
    // Cytaty o finansach i oszczędzaniu z pozycjonowaniem
    const quotes = [
        {
            text: 'Bogactwo to nie grzech. To dowód, że nauczyłeś się dostarczać wartości innym.',
            author: 'Grant Cardone',
            color: '#ff6b9d',
            rotation: -3,
            offsetX: '5%',
            offsetY: '0%',
        },
        {
            text: 'Nie oszczędzaj tego, co zostało po wydatkach, ale wydawaj to, co zostało po oszczędzaniu.',
            author: 'Warren Buffett',
            color: '#4ecdc4',
            rotation: 2,
            offsetX: '65%',
            offsetY: '5%',
        },
        {
            text: 'Inwestycja w wiedzę zawsze przynosi najlepsze odsetki.',
            author: 'Benjamin Franklin',
            color: '#ffd93d',
            rotation: -2,
            offsetX: '30%',
            offsetY: '35%',
        },
        {
            text: 'Nawyk zarządzania pieniędzmi jest ważniejszy niż ilość posiadanych pieniędzy.',
            author: 'T. Harv Eker',
            color: '#a8e6cf',
            rotation: 4,
            offsetX: '70%',
            offsetY: '45%',
        },
        {
            text: 'Zasada nr 1: Nigdy nie trać pieniędzy. Zasada nr 2: Zawsze pamiętaj o zasadzie nr 1.',
            author: 'Warren Buffett',
            color: '#c7ceea',
            rotation: -4,
            offsetX: '10%',
            offsetY: '65%',
        },
        {
            text: 'Sukces finansowy to nie kwestia tego ile zarabiasz, ale tego ile zatrzymujesz.',
            author: 'Robert Kiyosaki',
            color: '#ffb4a2',
            rotation: 3,
            offsetX: '55%',
            offsetY: '75%',
        },
    ];

    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.15,
                duration: 0.6,
                ease: 'easeOut',
            },
        }),
    };

    return (
        <Box
            id="testimonials"
            component="section"
            sx={{
                py: { xs: 8, md: 12 },
                px: { xs: 2, sm: 3 },
                backgroundColor: 'background.paper',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Container maxWidth="lg">
                {/* Quotes Container */}
                <Box
                    sx={{
                        position: 'relative',
                        minHeight: { xs: '800px', md: '600px' },
                        width: '100%',
                    }}
                >
                    {quotes.map((quote, index) => (
                        <Box
                            key={index}
                            component={motion.div}
                            custom={index}
                            variants={fadeIn}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            sx={{
                                position: { xs: 'relative', md: 'absolute' },
                                left: { xs: 0, md: quote.offsetX },
                                top: { xs: 'auto', md: quote.offsetY },
                                transform: {
                                    xs: 'none',
                                    md: `rotate(${quote.rotation}deg)`,
                                },
                                maxWidth: { xs: '100%', sm: '450px', md: '380px' },
                                mb: { xs: 4, md: 0 },
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: {
                                        xs: 'scale(1.02)',
                                        md: `rotate(0deg) scale(1.05)`,
                                    },
                                },
                            }}
                        >
                            {/* Quote Icon */}
                            <FormatQuoteIcon
                                sx={{
                                    fontSize: 50,
                                    color: quote.color,
                                    opacity: 0.2,
                                    mb: 1,
                                }}
                            />

                            {/* Quote Text */}
                            <Typography
                                variant="body1"
                                sx={{
                                    fontStyle: 'italic',
                                    color: 'text.secondary',
                                    lineHeight: 1.8,
                                    fontSize: { xs: '1.1rem', md: '1.15rem' },
                                    mb: 2,
                                }}
                            >
                                "{quote.text}"
                            </Typography>

                            {/* Author */}
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 700,
                                    color: quote.color,
                                    fontSize: '1rem',
                                    letterSpacing: '0.5px',
                                    textShadow: `0 0 10px ${quote.color}40`,
                                }}
                            >
                                ~ {quote.author}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default QuotesSection;