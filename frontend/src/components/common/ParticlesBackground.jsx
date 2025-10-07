// src/components/common/ParticlesBackground.jsx
import React from 'react';
import { Box } from '@mui/material';

const ParticlesBackground = () => {
    // Generujemy 50 losowych cząsteczek
    const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 1,
        left: Math.random() * 100,
        animationDuration: Math.random() * 20 + 10,
        animationDelay: Math.random() * 5,
        opacity: Math.random() * 0.5 + 0.3,
    }));

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                zIndex: 0,
                pointerEvents: 'none',
                maxHeight: '100%', // Ogranicz wysokość
            }}
        >
            {particles.map((particle) => (
                <Box
                    key={particle.id}
                    sx={{
                        position: 'absolute',
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        backgroundColor: '#00f0ff',
                        borderRadius: '50%',
                        left: `${particle.left}%`,
                        bottom: '-10px',
                        opacity: particle.opacity,
                        boxShadow: `0 0 ${particle.size * 3}px ${particle.size}px rgba(0, 240, 255, 0.3)`,
                        animation: `float ${particle.animationDuration}s ease-in-out ${particle.animationDelay}s infinite`,
                        '@keyframes float': {
                            '0%': {
                                transform: 'translateY(0) translateX(0)',
                                opacity: 0,
                            },
                            '10%': {
                                opacity: particle.opacity,
                            },
                            '90%': {
                                opacity: particle.opacity,
                            },
                            '100%': {
                                transform: `translateY(-100vh) translateX(${Math.random() * 100 - 50}px)`,
                                opacity: 0,
                            },
                        },
                    }}
                />
            ))}
        </Box>
    );
};

export default ParticlesBackground;