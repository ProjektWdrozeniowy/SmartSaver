// src/components/common/ScrollToTop.jsx
import React, { useState, useEffect } from 'react';
import { Fab, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Pokazuj przycisk po przewinięciu 300px w dół
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    // Scroll do góry
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <Zoom in={isVisible}>
            <Fab
                onClick={scrollToTop}
                size="medium"
                aria-label="scroll to top"
                sx={{
                    position: 'fixed',
                    bottom: { xs: 20, md: 30 },
                    right: { xs: 20, md: 30 },
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    boxShadow: '0 0 20px 5px rgba(0, 240, 255, 0.4)',
                    transition: 'all 0.3s ease',
                    zIndex: 1000,
                    '&:hover': {
                        backgroundColor: 'primary.dark',
                        boxShadow: '0 0 30px 8px rgba(0, 240, 255, 0.6)',
                        transform: 'translateY(-5px)',
                    },
                }}
            >
                <KeyboardArrowUpIcon />
            </Fab>
        </Zoom>
    );
};

export default ScrollToTop;