// src/components/landing/QuotesSection.jsx
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const QuotesSection = () => {
    const quotes = [
        {
            text: 'Bogactwo to nie grzech. To dowód, że nauczyłeś się dostarczać wartości innym.',
            author: 'Grant Cardone',
            color: '#ff6b9d',
        },
        {
            text: 'Nie oszczędzaj tego, co zostało po wydatkach, ale wydawaj to, co zostało po oszczędzaniu.',
            author: 'Warren Buffett',
            color: '#4ecdc4',
        },
        {
            text: 'Inwestycja w wiedzę zawsze przynosi najlepsze odsetki.',
            author: 'Benjamin Franklin',
            color: '#ffd93d',
        },
        {
            text: 'Nawyk zarządzania pieniędzmi jest ważniejszy niż ilość posiadanych pieniędzy.',
            author: 'T. Harv Eker',
            color: '#a8e6cf',
        },
        {
            text: 'Zasada nr 1: Nigdy nie trać pieniędzy. Zasada nr 2: Zawsze pamiętaj o zasadzie nr 1.',
            author: 'Warren Buffett',
            color: '#c7ceea',
        },
        {
            text: 'Sukces finansowy to nie kwestia tego ile zarabiasz, ale tego ile zatrzymujesz.',
            author: 'Robert Kiyosaki',
            color: '#ffb4a2',
        },
    ];

    // DUBLUJEMY LISTĘ → efekt ciągłej pętli
    const loopQuotes = [...quotes, ...quotes];

    return (
        <Box
            id="testimonials"
            component="section"
            sx={{
                py: { xs: 8, md: 12 },
                px: { xs: 2, sm: 3 },
                backgroundColor: 'background.paper',
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        height: '800px',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10,
                            animation: 'scrollLoop 28s linear infinite',
                            position: 'absolute',
                            width: '100%',
                        }}
                    >
                        {loopQuotes.map((quote, index) => (
                            <Box
                                key={index}
                                sx={{
                                    maxWidth: '500px',
                                    transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`,
                                    marginLeft: index % 2 === 0 ? '0' : '50%',
                                }}
                            >
                                <FormatQuoteIcon
                                    sx={{
                                        fontSize: 45,
                                        color: quote.color,
                                        opacity: 0.25,
                                        mb: 1,
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontStyle: 'italic',
                                        color: 'text.secondary',
                                        lineHeight: 1.8,
                                        fontSize: { xs: '1.1rem', md: '1.2rem' },
                                        mb: 1,
                                    }}
                                >
                                    "{quote.text}"
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        color: quote.color,
                                        fontSize: '1rem',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    ~ {quote.author}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    <style>
                        {`
                        @keyframes scrollLoop {
                            0% {
                                transform: translateY(0);
                            }
                            100% {
                                transform: translateY(-50%);
                            }
                        }
                        `}
                    </style>
                </Box>
            </Container>
        </Box>
    );
};

export default QuotesSection;
